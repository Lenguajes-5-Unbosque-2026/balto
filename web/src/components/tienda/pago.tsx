"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { BotonVolver } from "@/components/boton-volver"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionRadio } from "@/components/opcion-radio"
import { Pasos } from "@/components/pasos"
import type { PropsTienda } from "@/components/tienda/comun"
import { Totales } from "@/components/tienda/carrito"
import { puedeVolver } from "@/lib/navegacion"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import type { Direccion } from "@/lib/datos"
import { AHORA, HOY, fechaCorta, sumarDias } from "@/lib/fecha"
import { BANCOS, TARJETA_RECHAZADA, precio } from "@/lib/tienda"
import { guardarCita } from "@/lib/usar-proveedores"
import { guardarDireccion, guardarMetodo, guardarPedido, guardarSeleccion, useTienda, vaciarCarrito } from "@/lib/usar-tienda"

type Paso = "pago" | "direccion" | "metodo" | "pse" | "rechazado"

/** N7 · Entrega y pago, con N12 (dirección), N13 (medio de pago), N16 (PSE) y N14 (pago rechazado). */
export function Pago(datos: PropsTienda) {
  const router = useRouter()
  const tienda = useTienda(datos)
  const { carrito, subtotal, envio, total, conAlimento, direcciones, metodos, direccion, metodo, pedidos } = tienda
  const [paso, setPaso] = useState<Paso>("pago")
  const [confirmando, setConfirmando] = useState(false)
  // Mientras se va a N8, el carrito ya está vacío: no se muestra el estado vacío.
  const [pagado, setPagado] = useState(false)
  const tarjeta = metodos.find((m) => m.id === metodo)

  function crearPedido(metodoPago: "tarjeta" | "pse") {
    const numero = String(Math.max(...pedidos.map((p) => Number(p.numero)), 0) + 1).padStart(6, "0")
    const id = crypto.randomUUID()
    const items = carrito.map((i) => {
      let cita_id: string | undefined
      if (i.producto.tipo !== "alimento" && i.proveedor_id && i.fecha_hora) {
        // La aplicación de la vacuna queda como cita en el calendario (K6).
        cita_id = crypto.randomUUID()
        guardarCita(cita_id, {
          dueno_id: DUENO_ACTUAL_ID,
          mascota_id: i.mascota_id,
          proveedor_id: i.proveedor_id,
          servicio: i.producto.tipo === "vacuna" ? "Vacunación" : "Desparasitación",
          fecha_hora: i.fecha_hora,
          duracion_min: "30",
          estado: "confirmada",
          alerta_id: "",
          pedido_id: id,
        })
      }
      return { clave: i.clave, producto_id: i.producto_id, cantidad: i.cantidad, mascota_id: i.mascota_id, proveedor_id: i.proveedor_id, fecha_hora: i.fecha_hora, precio_unitario: Number(i.producto.precio_cop), cita_id }
    })
    guardarPedido({
      id,
      numero,
      direccion_id: conAlimento ? (direccion?.id ?? "") : "",
      metodo_pago: metodoPago,
      metodo_pago_id: metodoPago === "tarjeta" ? metodo : "",
      subtotal: String(subtotal),
      envio: String(envio),
      total: String(total),
      estado_pago: "aprobado",
      estado_entrega: conAlimento ? "preparacion" : "",
      ventana_entrega: conAlimento ? `${fechaCorta(sumarDias(HOY, 1)).replace(/ \d{4}$/, "")} · 8 a. m.–12 m.` : "",
      fecha: `${HOY} ${AHORA}`,
      items,
    })
    setPagado(true)
    vaciarCarrito(carrito.map((i) => i.clave))
    router.replace(`/tienda/confirmado?id=${id}`)
  }

  function pagar() {
    if (metodo === "pse") {
      setPaso("pse")
      return
    }
    // Pasarela simulada: la tarjeta de prueba terminada en 0002 se rechaza.
    if (tarjeta?.ultimos_4 === TARJETA_RECHAZADA) setPaso("rechazado")
    else crearPedido("tarjeta")
  }

  if (pagado) return null
  if (carrito.length === 0 && paso !== "rechazado") {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Pago" izquierda={<BotonVolver respaldo="/tienda/carrito" />} />
        <Estado icono="shopping_cart" titulo="Tu carrito está vacío" />
        <BotonEnlace href="/tienda">Ir a la tienda</BotonEnlace>
      </main>
    )
  }

  if (paso === "direccion") return <ElegirDireccion direcciones={direcciones} actual={direccion} onListo={() => setPaso("pago")} />
  if (paso === "metodo") return <AgregarMetodo onVolver={() => setPaso("pago")} />

  if (paso === "rechazado") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Pago" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setPaso("pago")} />} />
        <div className="pt-4">
          <Estado tono="error" icono="credit_card_off" titulo="No pudimos cobrar el pedido" />
        </div>
        <Nota icono="shopping_cart">Guardamos tu carrito. Prueba con otra tarjeta o con PSE.</Nota>
        <p className="text-center texto-cuerpo text-texto-secundario">Tu banco rechazó la transacción. No se hizo ningún cobro.</p>
        <BarraAccion>
          <Boton onClick={() => setPaso("pago")} className="px-2 texto-cuerpo-fuerte">
            Probar otro medio
          </Boton>
          <BotonEnlace href="/tienda/carrito" variante="secundario">
            Ver el carrito
          </BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "pse") {
    return (
      <PagoPse
        total={total}
        confirmando={confirmando}
        onCancelar={() => setPaso("pago")}
        onContinuar={() => {
          // Sin pasarela todavía: se simula la vuelta del banco con el pago aprobado.
          setConfirmando(true)
          setTimeout(() => crearPedido("pse"), 1600)
        }}
      />
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Pago" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => (puedeVolver() ? router.back() : router.push("/tienda/carrito"))} />} />
      <Pasos paso={2} total={2} nombre="Entrega y pago" />
      {conAlimento && direccion && (
        <>
          <span className="texto-micro text-texto-secundario">Entrega del alimento</span>
          <FilaOpcion
            borde
            icono={direccion.nombre === "Oficina" ? "work" : "home"}
            titulo={direccion.nombre}
            detalle={`${direccion.direccion}, ${direccion.barrio}`}
            derecha={<span className="texto-etiqueta-fuerte text-primario">Cambiar</span>}
            onClick={() => setPaso("direccion")}
          />
        </>
      )}
      <span className="texto-micro text-texto-secundario">Método de pago</span>
      <div role="radiogroup" className="flex flex-col gap-3">
        <OpcionRadio icono="account_balance" titulo="PSE" activa={metodo === "pse"} onElegir={() => guardarSeleccion({ metodo: "pse" })} />
        {metodos.map((m) => (
          <OpcionRadio key={m.id} icono="credit_card" titulo={`Tarjeta terminada en ${m.ultimos_4}`} detalle={m.franquicia} activa={metodo === m.id} onElegir={() => guardarSeleccion({ metodo: m.id })} />
        ))}
        <button type="button" onClick={() => setPaso("metodo")} className="flex items-center gap-2 self-start p-1 texto-etiqueta-fuerte text-primario">
          <Icono nombre="add" className="icono-s" />
          Agregar método de pago
        </button>
      </div>
      <Totales etiqueta="Productos" subtotal={subtotal} envio={envio} vacunas={false} />
      <BarraAccion>
        <Boton disabled={!metodo} onClick={pagar}>
          Pagar {precio(total)}
          <Icono nombre="lock" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** N12 · Dirección de entrega: una guardada o una nueva con indicaciones. */
function ElegirDireccion({ direcciones, actual, onListo }: { direcciones: Direccion[]; actual?: Direccion; onListo: () => void }) {
  const [elegida, setElegida] = useState(actual?.id ?? "")
  const [nueva, setNueva] = useState("")
  const [indicaciones, setIndicaciones] = useState("")
  const fuera = nueva.trim() !== "" && /medell|cali|barranquilla|cartagena|bucaramanga|ch[ií]a|soacha/i.test(nueva)

  function usar() {
    if (nueva.trim()) {
      const id = crypto.randomUUID()
      const [direccion, barrio = "Bogotá"] = nueva.split(",").map((x) => x.trim())
      guardarDireccion({ id, nombre: "Otra dirección", direccion, barrio, indicaciones, predeterminada: "false" })
      guardarSeleccion({ direccion_id: id })
    } else {
      guardarSeleccion({ direccion_id: elegida })
    }
    onListo()
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Dirección de entrega" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onListo} />} />
      {direcciones.map((d) => (
        <FilaOpcion
          key={d.id}
          icono={d.nombre === "Oficina" ? "work" : d.nombre === "Casa" ? "home" : "location_on"}
          titulo={d.nombre}
          detalle={`${d.direccion}, ${d.barrio}`}
          derecha={<Icono nombre={elegida === d.id && !nueva ? "check_circle" : "chevron_right"} className="icono-m text-texto-secundario" />}
          onClick={() => {
            setElegida(d.id)
            setNueva("")
          }}
        />
      ))}
      <Campo etiqueta="Agregar dirección" icono="add_location" placeholder="Calle, número y barrio" valor={nueva} onCambio={setNueva} />
      {fuera && <span className="-mt-1 texto-etiqueta text-error">Por ahora solo entregamos en Bogotá.</span>}
      <Campo etiqueta="Indicaciones" icono="sticky_note_2" placeholder="Torre, apartamento o portería" valor={indicaciones} onCambio={setIndicaciones} />
      <Nota icono="local_shipping">Entregamos en Bogotá de lunes a sábado, entre 8 a. m. y 6 p. m.</Nota>
      <BarraAccion>
        <Boton disabled={fuera || (!nueva.trim() && !elegida)} onClick={usar}>
          Usar esta dirección
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** N13 · Agregar método de pago: tarjeta (se guardan solo los últimos 4 dígitos) o PSE. */
function AgregarMetodo({ onVolver }: { onVolver: () => void }) {
  const [tipo, setTipo] = useState<"tarjeta" | "pse">("tarjeta")
  const [numero, setNumero] = useState("")
  const [vence, setVence] = useState("")
  const [cvv, setCvv] = useState("")
  const [nombre, setNombre] = useState("")
  const [banco, setBanco] = useState(BANCOS[0])
  const digitos = numero.replace(/\D/g, "")
  const valida = digitos.length >= 15 && /^\d{2}\/\d{2}$/.test(vence) && cvv.length >= 3

  function guardar() {
    if (tipo === "pse") {
      guardarSeleccion({ metodo: "pse" })
    } else {
      const id = crypto.randomUUID()
      const franquicia = digitos.startsWith("4") ? "Visa" : digitos.startsWith("5") ? "Mastercard" : digitos.startsWith("3") ? "American Express" : "Tarjeta"
      guardarMetodo({ id, tipo: "tarjeta", franquicia, ultimos_4: digitos.slice(-4), predeterminado: "false" })
      guardarSeleccion({ metodo: id })
    }
    onVolver()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Método de pago" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onVolver} />} />
      <div className="flex gap-2">
        <Chip texto="Tarjeta" icono="credit_card" activo={tipo === "tarjeta"} onClick={() => setTipo("tarjeta")} />
        <Chip texto="PSE" icono="account_balance" activo={tipo === "pse"} onClick={() => setTipo("pse")} />
      </div>
      {tipo === "tarjeta" ? (
        <>
          <Campo
            etiqueta="Número de tarjeta"
            icono="credit_card"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            valor={digitos.replace(/(\d{4})(?=\d)/g, "$1 ")}
            onCambio={(v) => setNumero(v.replace(/\D/g, "").slice(0, 16))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Campo
              etiqueta="Vencimiento"
              icono="event"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              valor={vence}
              onCambio={(v) => {
                const d = v.replace(/\D/g, "").slice(0, 4)
                setVence(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
              }}
            />
            <Campo etiqueta="CVV" type="password" icono="lock" inputMode="numeric" autoComplete="cc-csc" placeholder="•••" valor={cvv} onCambio={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))} />
          </div>
          <Campo etiqueta="Nombre en la tarjeta" icono="person" autoComplete="cc-name" placeholder="Como aparece en la tarjeta" valor={nombre} onCambio={setNombre} />
          <Nota icono="shield">Pago seguro. No guardamos el número completo de tu tarjeta.</Nota>
        </>
      ) : (
        <>
          <span className="texto-micro text-texto-secundario">Banco</span>
          <div className="flex flex-wrap gap-2">
            {BANCOS.map((b) => (
              <Chip key={b} texto={b} activo={banco === b} onClick={() => setBanco(b)} />
            ))}
          </div>
          <Nota icono="account_balance">Al pagar te llevamos a {banco} para autorizar el pago.</Nota>
        </>
      )}
      <BarraAccion>
        <Boton disabled={tipo === "tarjeta" && !valida} onClick={guardar}>
          Guardar y continuar
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** N16 · Pagar con PSE: banco y tipo de persona antes de salir al banco. */
function PagoPse({ total, confirmando, onCancelar, onContinuar }: { total: number; confirmando: boolean; onCancelar: () => void; onContinuar: () => void }) {
  const [banco, setBanco] = useState("")
  const [persona, setPersona] = useState<"Natural" | "Jurídica">("Natural")
  const [eligiendo, setEligiendo] = useState<"banco" | "persona" | null>(null)
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Pagar con PSE" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onCancelar} />} />
      <div className="pt-4">
        <Estado icono="account_balance" titulo="Te llevamos a tu banco" mensaje={`Vas a salir de Balto para autorizar el pago de ${precio(total)} en PSE.`} />
      </div>
      <FilaOpcion icono="account_balance" titulo="Banco" detalle={banco || "Elige tu entidad"} onClick={() => setEligiendo("banco")} />
      <FilaOpcion icono="person" titulo="Tipo de persona" detalle={persona} onClick={() => setEligiendo("persona")} />
      <Nota icono="sync">Cuando termines, vuelve a Balto para confirmar el pago.</Nota>
      <BarraAccion>
        <Boton disabled={!banco || confirmando} onClick={onContinuar} className="px-2 texto-cuerpo-fuerte">
          {confirmando ? "Confirmando el pago…" : "Continuar a PSE"}
        </Boton>
        <Boton variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </BarraAccion>
      <Hoja abierta={!!eligiendo} onCerrar={() => setEligiendo(null)} titulo={eligiendo === "banco" ? "Elige tu banco" : "Tipo de persona"}>
        <div role="radiogroup" className="flex flex-col gap-2.5">
          {(eligiendo === "banco" ? BANCOS : ["Natural", "Jurídica"]).map((x) => (
            <OpcionRadio
              key={x}
              titulo={x}
              activa={(eligiendo === "banco" ? banco : persona) === x}
              onElegir={() => {
                if (eligiendo === "banco") setBanco(x)
                else setPersona(x as typeof persona)
                setEligiendo(null)
              }}
            />
          ))}
        </div>
      </Hoja>
    </main>
  )
}
