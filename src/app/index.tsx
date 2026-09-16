import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AplicacionPrincipal() {
    const [versiculoActual, establecerVersiculoActual] = useState<string>("Cargando...");
    const opacidadDelTexto = useRef(new Animated.Value(0)).current;
    const posicionVerticalDelTexto = useRef(new Animated.Value(50)).current;
    const referenciaDelContenedorDesplazable = useRef<ScrollView>(null);
    const alturaDeLaPantalla = Dimensions.get('window').height;

    const obtenerVersiculoDesdeApi = async (): Promise<void> => {
        try {
            const respuestaDeRed = await fetch('https://bible-api.com/?random=verse');
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
            Animated.timing(opacidadDelTexto, { toValue: 1, duration: 2000, useNativeDriver: true }),
            Animated.timing(posicionVerticalDelTexto, { toValue: 0, duration: 2000, useNativeDriver: true })
        ]).start();
    }, [versiculoActual]);

    const desplazarHaciaLaSeccion = (posicionY: number) => {
        referenciaDelContenedorDesplazable.current?.scrollTo({ y: posicionY, animated: true });
    };

    return (
        <View style={estilos.contenedorPrincipal}>
            <View style={estilos.barraDeNavegacion}>
                <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(0)}>
                    <Text style={estilos.textoDeLaBarra}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(alturaDeLaPantalla)}>
                    <Text style={estilos.textoDeLaBarra}>Encuentra a Jesús</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => desplazarHaciaLaSeccion(alturaDeLaPantalla + 300)}>
                    <Text style={estilos.textoDeLaBarra}>¿Necesitas ayuda?</Text>
                </TouchableOpacity>
            </View>

            <ScrollView ref={referenciaDelContenedorDesplazable} style={estilos.contenedorDesplazable}>
                <View style={[estilos.seccionInicio, { height: alturaDeLaPantalla }]}>
                    <Animated.Text
                        style={[
                            estilos.textoDelVersiculo,
                            {
                                opacity: opacidadDelTexto,
                                transform: [
                                    { translateY: posicionVerticalDelTexto },
                                    { scaleY: 1.8 },
                                    { scaleX: 0.7 }
                                ]
                            }
                        ]}
                    >
                        {versiculoActual}
                    </Animated.Text>
                </View>

                <View style={estilos.seccionInformacion}>
                    <Text style={estilos.tituloSeccion}>Encontrar a Jesús</Text>
                    <Text style={estilos.textoCuerpo}>Jesús enseñó el amor al prójimo y el perdón. Empieza leyendo los Evangelios, orando en silencio y buscando una comunidad que te apoye en tu crecimiento personal y espiritual.</Text>
                </View>

                <View style={estilos.seccionInformacion}>
                    <Text style={estilos.tituloSeccion}>Prevención y Ayuda Urgente</Text>
                    <Text style={estilos.textoCuerpo}>Si estás pasando por un momento muy difícil, hay personas que quieren escucharte y ayudarte ahora mismo de forma anónima y gratuita.</Text>
                    <Text style={estilos.textoResaltado}>Línea de atención a la conducta suicida: 024</Text>
                    <Text style={estilos.textoResaltado}>Teléfono de la Esperanza: 717 003 717</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedorPrincipal: {
        flex: 1,
        backgroundColor: '#000000',
    },
    barraDeNavegacion: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10,
        gap: 40,
    },
    textoDeLaBarra: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    contenedorDesplazable: {
        flex: 1,
    },
    seccionInicio: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 40,
        paddingRight: 20,
    },
    textoDelVersiculo: {
        fontSize: 50,
        textAlign: 'left',
        color: '#ffffff',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0,
        lineHeight: 60,
    },
    seccionInformacion: {
        padding: 40,
        paddingTop: 60,
        paddingBottom: 60,
        borderTopWidth: 1,
        borderColor: '#333333',
        minHeight: 300,
    },
    tituloSeccion: {
        fontSize: 30,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily:'arial',
        marginBottom: 20,
    },
    textoCuerpo: {
        fontSize: 20,
        color: '#cccccc',
        fontFamily: 'times new roman',
        lineHeight: 28,
        marginBottom: 10,
    },
    textoResaltado: {
        fontSize: 15,
        color: '#ffffff',
        fontWeight: 'bold',
        marginTop: 15,
    },
});