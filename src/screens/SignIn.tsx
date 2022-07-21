import { Heading, Icon, useTheme, VStack } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import React, { useState } from "react";
import { Alert } from "react-native";
import Logo from '../assets/logo_primary.svg'
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import auth from '@react-native-firebase/auth' //conexão com o firebase


export default function SigIn(){
  const [isLoading, setIsLoading] = useState(false)
  const {colors} = useTheme()

  const [ email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogIn(){
    //se o email ou a senha forem nulos, emitir um alerta
    if(!email || !password){
      return Alert.alert('Entrar', 'Informe Email e Senha');
    }

    setIsLoading(true)

    //abaixo já está sendo verificado direto no firebase as informações
    auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error);
      setIsLoading(false);

      if(error.code === 'auth/invalid-email'){
        return Alert.alert('Entrar', 'E-mail inválida.')
      }

      if(error.code === 'auth/wrong-password'){
        return Alert.alert('Entrar', 'E-mail ou senha inválida.')
      }

      if(error.code === 'auth/user-not-found'){
        return Alert.alert('Entrar', 'E-mail ou senha inválida.');
      }

      return Alert.alert('Entrar', 'Não foi possível acessar') //caso ocorra algum erro que não foi tratado antes, vai retornar essa mensagem
    })

  }
  return(
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo/>
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Acesse sua conta</Heading>
      <Input placeholder="Email"
      mb={4}
      InputLeftElement={<Icon as = {<Envelope color={colors.gray[300]} />} ml={4}/>}
      onChangeText={setEmail}
      />
      <Input placeholder="Senha"
      mb={8}
      InputLeftElement={<Icon as = {<Key color={colors.gray[300]} />} ml={4}/>}
      secureTextEntry //transformar as letra em bolinhas
      onChangeText={setPassword}
      />
      <Button 
      isLoading={isLoading} //faz o botão ficar com efeito de carregando
      title="Entrar" 
      w="full" 
      onPress={handleLogIn}/>
    </VStack>
  )
}