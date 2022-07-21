import { VStack } from "native-base";
import { useState } from "react";
import { Alert } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from "@react-navigation/native";


export function Register(){
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  function handleNewOrderRegister(){
    //validar se o patrimonio e descrição foram informados
    if(!patrimony || !description ){
      return Alert.alert('Registrar', 'Preencha todos os campos')
    }

    setIsLoading(true);

    firestore()
    .collection('orders')//caso a coleção já exista a informação será cadastrada, caso não exista a coleção será criada e a informação cadastrada
    .add({ //adicionar um novo elemento/registro
      patrimony,
      description,
      status: 'open',
      created_at: firestore.FieldValue.serverTimestamp()
      //função serverTimeStamp é do próprio firebase, usado para salvar o horário que foi adicionada a informação na coleção
    })
    .then(() => {
      Alert.alert('Solicitação', 'solicitação registrada com sucesso')// informa que a solicitação foi cadastrada com sucesso
      navigation.goBack() //leva para a tela anterior (home)
    })
    //se der erro
    .catch((error) => {
      console.log(error);
      setIsLoading(false)
      return Alert.alert('Solicitação', 'Não foi possível registrar o pedido')
    })

  }

  return(
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação"/>
      <Input
      placeholder="Número do patrimônio"
      mt={4}
      //usado para capturar o texto digitado no input
      onChangeText={setPatrimony}
      />
      <Input
      placeholder="Descrição do problema"
      flex={1}
      mt={5}
      multiline
      textAlignVertical="top"
      //usado para capturar o texto digitado no input
      onChangeText={setDescription}
      />

      <Button 
      title="Cadastrar" 
      mt={5}
      isLoading={isLoading}
      onPress={handleNewOrderRegister}/>
    </VStack>
  )
}