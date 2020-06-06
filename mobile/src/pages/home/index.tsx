import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";


interface select {
  label: string;
  value: string;
  key: string;
}

const Home = () => {
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
  const [ufList, setUflist] = useState<select[]>([]);
  const [cityList, setCityList] = useState<select[]>([]);
  const navigation = useNavigation();

  console.log(uf, city);

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(response => {
        const dataObjectArray = response.data;

        const UfSerialized = dataObjectArray.map((uf: { sigla: string }) => {
          return {
            label: uf.sigla,
            value: uf.sigla,
            key: uf.sigla
          }
        })
        
        setUflist(UfSerialized);
      })
  },[]);

  useEffect(() => {
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        const dataObjectArray = response.data;

        const citiesSerialized = dataObjectArray.map((city: { nome: string })=> {
          return {
            label: city.nome,
            value: city.nome,
            key: city.nome
          }
        })

        setCityList(citiesSerialized);
      })
  },[uf])

  function handleNavigationToPoints() {
    navigation.navigate("Points", {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 273, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        {/* <TextInput 
          style={styles.input} 
          placeholder="Digite a uf"
          onChangeText={setUf} 
        /> */}
        <RNPickerSelect
          onValueChange={setUf}
          style={{viewContainer: styles.viewContainer, placeholder: styles.viewPlaceholder}} 
          items={ufList}
          placeholder={{label:'Selecione um estado'}}
        />
        {/* <TextInput 
          style={styles.input} 
          placeholder="Digite a cidade"
          onChangeText={setCity} 
        /> */}
        <RNPickerSelect 
          onValueChange={setCity}
          style={{viewContainer: styles.viewContainer}}
          items={cityList}
          placeholder={{label:"Selecione uma cidade"}}
        />

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  viewContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 8,
  },

  viewPlaceholder: {
    textAlign: "center"
  }
});

export default Home;
