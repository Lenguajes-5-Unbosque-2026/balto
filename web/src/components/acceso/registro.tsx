"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { CasillasCodigo, ReglasClave } from "@/components/acceso/comunes"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionCasilla } from "@/components/opcion-casilla"
import { Pasos } from "@/components/pasos"
import { correoValido, crearCuenta, existeCuenta, iniciarSesion, nuevoCodigo, reglasClave, verificarCuenta } from "@/lib/acceso"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import { guardarDueno } from "@/lib/usar-cuenta"

const VIGENCIA_MS = 10 * 60 * 1000
const INTENTOS = 3

type Paso = "cuenta" | "codigo" | "incorrecto" | "vencido" | "bloqueado" | "datos"

/** A3 · Crear cuenta → A4 · Verificar correo (A12, A13, A13.2) → A5 · Datos del dueño → B1. */
export function Registro() {
  const router = useRouter()
  const pendiente = useSearchParams().get("verificar")
  const [paso, setPaso] = useState<Paso>(pendiente ? "codigo" : "cuenta")
  const [correo, setCorreo] = useState(pendiente ?? "")
  const [clave, setClave] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [terminos, setTerminos] = useState(false)
  const [yaExiste, setYaExiste] = useState(false)
  // Desde A6 con una cuenta sin verificar se llega con un código nuevo ya enviado.
  const [codigo, setCodigo] = useState(() => (pendiente ? { valor: nuevoCodigo(), creado: Date.now() } : { valor: "", creado: 0 }))
  const [escrito, setEscrito] = useState("")
  const [fallos, setFallos] = useState(0)
  const [espera, setEspera] = useState(pendiente ? 45 : 0)
  const [datos, setDatos] = useState({ nombre: "", ciudad: "Bogotá", telefono: "+57 " })

  const claveOk = reglasClave(clave).every((r) => r.ok)
  const coinciden = clave === confirmar

  // Contador de "Reenviar código en 0:45".
  useEffect(() => {
    if (espera <= 0) return
    const t = setTimeout(() => setEspera((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [espera])

  function enviarCodigo() {
    const valor = nuevoCodigo()
    setCodigo({ valor, creado: Date.now() })
    setEscrito("")
    setFallos(0)
    setEspera(45)
    // Sin servidor de correo todavía: el código se muestra como código de prueba.
    toast("Código de prueba", { description: `Usa ${valor} para verificar ${correo.trim()}.`, duration: 15000 })
    setPaso("codigo")
  }

  useEffect(() => {
    if (pendiente) toast("Código de prueba", { description: `Usa ${codigo.valor} para verificar ${pendiente}.`, duration: 15000 })
    // Solo al llegar: el código no cambia mientras se muestra.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function continuar() {
    if (await existeCuenta(correo)) {
      setYaExiste(true)
      return
    }
    await crearCuenta(correo, clave)
    enviarCodigo()
  }

  function verificar() {
    if (Date.now() - codigo.creado > VIGENCIA_MS) setPaso("vencido")
    else if (escrito === codigo.valor) {
      verificarCuenta(correo)
      setPaso("datos")
    } else if (fallos + 1 >= INTENTOS) setPaso("bloqueado")
    else {
      setFallos((x) => x + 1)
      setPaso("incorrecto")
    }
  }

  async function confirmarDatos() {
    guardarDueno(DUENO_ACTUAL_ID, { nombre: datos.nombre.trim(), ciudad: datos.ciudad.trim(), telefono: datos.telefono.trim(), correo: correo.trim() })
    if (clave) await iniciarSesion(correo, clave)
    router.replace("/mascotas/nueva")
  }

  const volver = () => {
    if (paso === "cuenta") router.back()
    else if (paso === "datos") setPaso("codigo")
    else setPaso("cuenta")
  }
  const encabezado = (titulo: string) => <Encabezado titulo={titulo} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
  const pasosVerificacion = <Pasos paso={2} total={3} nombre="Verificación" />
  const cambiarCorreo = (
    <Boton variante="secundario" onClick={() => setPaso("cuenta")} className="px-2 texto-cuerpo-fuerte">
      Cambiar de correo
    </Boton>
  )

  if (paso === "datos") {
    const telefonoOk = datos.telefono.replace(/\D/g, "").length >= 10
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Tus datos")}
        <Pasos paso={3} total={3} nombre="Datos del dueño" />
        <Campo etiqueta="Nombre completo" icono="person" autoComplete="name" valor={datos.nombre} onCambio={(v) => setDatos((x) => ({ ...x, nombre: v }))} />
        <Campo etiqueta="Ciudad" icono="location_on" valor={datos.ciudad} onCambio={(v) => setDatos((x) => ({ ...x, ciudad: v }))} />
        <Campo etiqueta="Teléfono de contacto" type="tel" icono="call" autoComplete="tel" valor={datos.telefono} onCambio={(v) => setDatos((x) => ({ ...x, telefono: v }))} />
        <Nota>Tu teléfono aparece en la vista rápida de tu mascota por si alguien la encuentra.</Nota>
        <BarraAccion>
          <Boton disabled={!datos.nombre.trim() || !datos.ciudad.trim() || !telefonoOk} onClick={confirmarDatos}>
            Confirmar
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "bloqueado" || paso === "vencido") {
    const bloqueado = paso === "bloqueado"
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Verificar correo")}
        {pasosVerificacion}
        <div className="pt-4">
          <Estado
            tono="error"
            icono={bloqueado ? "lock" : "timer_off"}
            titulo={bloqueado ? "Bloqueamos este código" : "El código venció"}
            mensaje={bloqueado ? "Fallaste 3 veces seguidas. Pide un código nuevo para seguir." : "Los códigos duran 10 minutos. Pide uno nuevo para seguir."}
          />
        </div>
        <Nota icono="mail">El código llega a {correo.trim()}.</Nota>
        <BarraAccion>
          <Boton onClick={enviarCodigo} className="px-2 texto-cuerpo-fuerte">
            Enviar código nuevo
          </Boton>
          {cambiarCorreo}
        </BarraAccion>
      </main>
    )
  }

  if (paso === "codigo" || paso === "incorrecto") {
    const incorrecto = paso === "incorrecto"
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Verificar correo")}
        {pasosVerificacion}
        <div className="pt-4">
          <Estado
            tono={incorrecto ? "error" : "exito"}
            icono={incorrecto ? "error" : "mark_email_read"}
            titulo={incorrecto ? "El código no coincide" : "Revisa tu correo"}
            mensaje={incorrecto ? "Revisa los 6 dígitos del correo o pide uno nuevo." : `Enviamos un código de 6 dígitos a ${correo.trim()}`}
          />
        </div>
        <CasillasCodigo valor={escrito} onCambio={setEscrito} error={incorrecto} />
        {incorrecto && (
          <Nota tono="error" icono="warning">
            Te {INTENTOS - fallos === 1 ? "queda 1 intento" : `quedan ${INTENTOS - fallos} intentos`} antes de bloquear el código.
          </Nota>
        )}
        <button type="button" disabled={espera > 0} onClick={enviarCodigo} className="self-center p-2 texto-etiqueta-fuerte text-primario disabled:text-texto-secundario">
          {espera > 0 ? `Reenviar código en 0:${String(espera).padStart(2, "0")}` : "Reenviar código"}
        </button>
        <BarraAccion>
          {incorrecto ? (
            <Boton
              onClick={() => {
                setEscrito("")
                setPaso("codigo")
              }}
            >
              Volver a intentar
            </Boton>
          ) : (
            <Boton disabled={escrito.length !== 6} onClick={verificar}>
              Verificar
            </Boton>
          )}
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado("Crear cuenta")}
      <Pasos paso={1} total={3} nombre="Tu cuenta" />
      <Campo
        etiqueta="Correo electrónico"
        type="email"
        icono="mail"
        autoComplete="email"
        placeholder="tu@correo.com"
        valor={correo}
        onCambio={(v) => {
          setCorreo(v)
          setYaExiste(false)
        }}
      />
      {correo && !correoValido(correo) && <span className="-mt-2 texto-etiqueta text-error">Revisa el correo.</span>}
      {yaExiste && (
        <span className="-mt-2 texto-etiqueta text-error">
          Este correo ya tiene cuenta.{" "}
          <Link href="/ingresar" className="texto-etiqueta-fuerte text-primario underline">
            Inicia sesión
          </Link>
        </span>
      )}
      <Campo etiqueta="Contraseña" type="password" icono="lock" autoComplete="new-password" valor={clave} onCambio={setClave} />
      <ReglasClave clave={clave} />
      <Campo etiqueta="Confirmar contraseña" type="password" icono="lock" autoComplete="new-password" valor={confirmar} onCambio={setConfirmar} />
      {confirmar && !coinciden && <span className="-mt-2 texto-etiqueta text-error">Las contraseñas no coinciden.</span>}
      <OpcionCasilla icono="description" titulo="Acepto los términos y la política de datos" marcada={terminos} onCambio={() => setTerminos((x) => !x)} />
      <div className="flex flex-col gap-3 pt-2 pb-9">
        <BotonEnlace href="/ingresar" variante="suave">
          Ya tengo cuenta
        </BotonEnlace>
        <Boton disabled={!correoValido(correo) || !claveOk || !coinciden || !terminos} onClick={continuar}>
          Continuar
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </div>
    </main>
  )
}
