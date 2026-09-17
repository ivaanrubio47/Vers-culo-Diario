import { useEffect, useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AplicacionPrincipal() {
  const [versiculoActual, establecerVersiculoActual] =
    useState<string>("Cargando...");
  const opacidadDelTexto = useRef(new Animated.Value(0)).current;
  const posicionVerticalDelTexto = useRef(new Animated.Value(50)).current;
  const referenciaDelContenedorDesplazable = useRef<ScrollView>(null);

  const obtenerVersiculoDesdeApi = async (): Promise<void> => {
    try {
      const respuestaDeRed = await fetch("https://bible-api.com/?random=verse");
      const datosEnFormatoJson = await respuestaDeRed.json();
      const textoAcomodado = `${datosEnFormatoJson.text.trim()}\n\n- ${datosEnFormatoJson.reference}`;
      establecerVersiculoActual(textoAcomodado);
    } catch (error) {
      establecerVersiculoActual("Error de conexión.");
    }
  };

  useEffect(() => {
    obtenerVersiculoDesdeApi();
    const milisegundosEnDosMinutos: number = 120000;
    const temporizadorIntervalo = setInterval(() => {
      obtenerVersiculoDesdeApi();
    }, milisegundosEnDosMinutos);
    return () => clearInterval(temporizadorIntervalo);
  }, []);

  useEffect(() => {
    opacidadDelTexto.setValue(0);
    posicionVerticalDelTexto.setValue(50);
    Animated.parallel([
      Animated.timing(opacidadDelTexto, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(posicionVerticalDelTexto, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [versiculoActual]);

  const desplazarHaciaLaSeccion = (posicionY: number) => {
    referenciaDelContenedorDesplazable.current?.scrollTo({
      y: posicionY,
      animated: true,
    });
  };

  return (
    <View style={estilos.contenedorPrincipal}>
      <View style={estilos.barraDeNavegacion}>
        <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(0)}>
          <Text style={estilos.textoDeLaBarra}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(800)}>
          <Text style={estilos.textoDeLaBarra}>Encontrar a Jesús</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(1500)}>
          <Text style={estilos.textoDeLaBarra}>Reflexión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(2100)}>
          <Text style={estilos.textoDeLaBarra}>Ayuda Urgente</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={referenciaDelContenedorDesplazable}
        style={estilos.contenedorDesplazable}
      >
        <View style={estilos.seccionInicio}>
          <Animated.View
            style={{
              opacity: opacidadDelTexto,
              transform: [{ translateY: posicionVerticalDelTexto }],
            }}
          >
            <View style={{ transform: [{ scaleY: 1.8 }, { scaleX: 0.7 }] }}>
              <Text style={estilos.textoDelVersiculo}>{versiculoActual}</Text>
            </View>
          </Animated.View>
        </View>

        <View style={estilos.seccionInformacion}>
          <Text style={estilos.tituloSeccion}>Encontrar a Jesús</Text>
          <Text style={estilos.textoCuerpo}>
            Jesús enseñó el amor al prójimo y el perdón. Empieza leyendo los
            Evangelios, orando en silencio y buscando una comunidad que te apoye
            en tu crecimiento personal y espiritual.
          </Text>
          <Text style={estilos.subtituloSeccion}>Primeros pasos:</Text>
          <Text style={estilos.textoCuerpo}>
            • Lee el Evangelio de Mateo, Marcos, Lucas o Juan{"\n"}• Busca una
            iglesia o comunidad cerca de ti{"\n"}• Habla con un sacerdote o
            pastor{"\n"}• Aprende sobre el Rosario y la oración diaria
          </Text>
        </View>

        <View style={estilos.seccionInformacion}>
          <Text style={estilos.tituloSeccion}>Reflexión del Día</Text>
          <Text style={estilos.textoCuerpo}>
            En momentos de incertidumbre, recuerda que no estás solo. Dios está
            contigo en cada paso. La fe no es la ausencia de dudas, sino la
            confianza de que hay un propósito mayor en tu vida.
          </Text>
          <Text style={[estilos.textoCuerpo, { marginTop: 15 }]}>
            "Porque Dios no nos ha dado un espíritu de cobardía, sino de poder,
            de amor y de dominio propio." — 2 Timoteo 1:7
          </Text>
        </View>

        <View style={estilos.seccionInformacion}>
          <Text style={estilos.tituloSeccion}>Oración de Hoy</Text>
          <Text style={estilos.textoCuerpo}>
            Tómate un momento para respirar profundamente y conectar contigo
            mismo. Esta es una invitación a la paz y la esperanza.
          </Text>
          <Text
            style={[
              estilos.textoCuerpo,
              { fontStyle: "italic", marginTop: 15 },
            ]}
          >
            "Señor, en este día te pido fuerza para seguir adelante. Ayúdame a
            ver la luz incluso en los momentos más oscuros. Gracias por tu amor
            infinito y tu misericordia. Amén."
          </Text>
        </View>

        <View style={estilos.seccionInformacion}>
          <Text style={estilos.tituloSeccion}>Prevención y Ayuda Urgente</Text>
          <Text style={estilos.textoCuerpo}>
            Si estás pasando por un momento muy difícil, hay personas que
            quieren escucharte y ayudarte ahora mismo de forma anónima y
            gratuita. No estás solo, y tu vida tiene valor.
          </Text>
          <Text style={estilos.textoResaltado}>
            Línea de atención a la conducta suicida: 024
          </Text>
          <Text style={estilos.textoResaltado}>
            Teléfono de la Esperanza: 717 003 717
          </Text>
          <Text style={[estilos.textoCuerpo, { marginTop: 15 }]}>
            También puedes contactar con:{"\n"}
            Teleasistencia: 914 59 00 50{"\n"}
            Salvación: 91 372 32 15
          </Text>
        </View>

        <View style={estilos.seccionFooter}>
          <Text style={estilos.textoFooter}>
            "La esperanza es lo último que se pierde" — Dicho popular
          </Text>
          <Text style={estilos.textoFooterPequeno}>
            Tu vida importa. Siempre hay una razón para seguir adelante.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: "#000000",
  },
  barraDeNavegacion: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10,
    gap: 40,
  },
  textoDeLaBarra: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "serif",
    textTransform: "uppercase",
  },
  contenedorDesplazable: {
    flex: 1,
    paddingTop: 100,
  },
  seccionInicio: {
    minHeight: 800,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 100,
  },
  textoDelVersiculo: {
    fontSize: 50,
    textAlign: "left",
    color: "#ffffff",
    fontFamily: "serif",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0,
    lineHeight: 60,
  },
  seccionInformacion: {
    padding: 40,
    paddingTop: 60,
    paddingBottom: 60,
    borderTopWidth: 1,
    borderColor: "#333333",
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  tituloSeccion: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "serif",
    fontWeight: "bold",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  subtituloSeccion: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "serif",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  textoCuerpo: {
    fontSize: 18,
    color: "#cccccc",
    lineHeight: 28,
    marginBottom: 10,
  },
  textoResaltado: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 15,
  },
  seccionFooter: {
    padding: 40,
    paddingTop: 60,
    paddingBottom: 60,
    borderTopWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    marginTop: 20,
  },
  textoFooter: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "serif",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  textoFooterPequeno: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
  },
});
