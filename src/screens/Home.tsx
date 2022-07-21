import { useNavigation } from "@react-navigation/native";
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";
import { useEffect, useState } from "react";
import Logo from '../assets/logo_secondary.svg'
import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";
import { DateFormat } from "../utils/FirestoreDateFormat";
import { Loading } from "../components/Loading";

export default function Home() {
  const [loading, setIsLoading] = useState(true);//no momento que a tela abrir, já vai estar carregando os dados
  const navigation = useNavigation();
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([])

  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate("new")
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId }) //na hora que clicar no card, o orderID será levado como parametro
  }

  function handleLogOut() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error);
        return Alert.alert('Sair', 'Não foi possivel sair.')
      })
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore() //acessar o firestore
      .collection('orders') //ir na collextion orders
      //onde o status é igual ao que está selecionado, ou seja, se o usuário está na aba de 'em andamento', ele irá buscar as orders com status 'em andamento'
      .where('status', '==', statusSelected)
      //atualiza a aplicação em tempo real 
      .onSnapshot(snapshot => {
        //percorre cada um dos documentos salvos
        const data = snapshot.docs.map(doc => {
          //desestruturar para acessar os elementos patrimony, description, status, created_at
          const { patrimony, description, status, created_at } = doc.data();

          //retornar os dados formatados
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: DateFormat(created_at)//passar a variável de data a ser formatada
          }
        })
        setOrders(data)
        setIsLoading(false)
      })

    return subscriber;
  }, [statusSelected])//vai atualizar toda vez que o status mudar

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogOut} />

      </HStack>
      <VStack flex={1} p={6}>
        <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
          <Heading color="gray.100">Solicitações</Heading>

          <Text color="gray.200">
            {orders.length}
          </Text>
        </HStack>
        <HStack
          space={3}
          mb={8}
        >
          <Filter
            title="Em andamento"
            type={"open"}
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter title="Fechado" type={"close"}
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>
        {
          //se estiver carregando irá aparecer o componente de Loading, caso contrário aparecerá a lista de solicitações
          loading ? <Loading /> :
            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}

              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText color={colors.gray[300]} size={40} />
                  <Text color="gray.300" fontSize="xl" mt={6} textAlign="center" >
                    Você ainda não possui {'\n'}solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                  </Text>
                </Center>
              )}
            />}
        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  )
}