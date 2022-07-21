import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { DateFormat } from '../utils/FirestoreDateFormat'
import { Loading } from "../components/Loading";
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [loading, setIsLoading] = useState(true)
  const [solution, setSolution] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)//o objeto está vazio mas o tipo dele é OrderDetails

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId) //buscar somente o documento do orderId
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at } = doc.data();

        //se houver uma data de encerramento, será feita a formatação da data, senão ficará nulo
        const closed = closed_at ? DateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: DateFormat(created_at),
          closed
        })
        setIsLoading(false)

      })

  }, [])

  //se estiver carregando mostrar o componente de loading
  if (loading) {
    <Loading />
  }

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Informe solução para encerrar a solicitação')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      //atualizar a informação de status, solution e closed_at
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      //se deu tudo certo, irá redirecionar para a tela anterior
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
      })
  }

  return (
    <VStack
      flex={1}
      bg="gray.700"
    >
      <Box px={6} bg="gray.600">
      <Header title="Solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {/* se a order estiver como fechada, vai renderizar o icone CircleWavyCheck senão aparecerá o icone Hourglass*/}
        {order.status === 'closed' ?
          <CircleWavyCheck size={22} color={colors.green[300]} /> :
          <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text
          fontSize="sm"
          //  se a order status estiver fechada o texto ficará verde, senão laranja
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="upercase"
        >
          {order.status === 'closed' ? 'finalizado ' : 'Em andamento'}
        </Text>
      </HStack>
      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetails
          title="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          //se já estiver encerrado, terá o footer com a data de encerramento
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' &&
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />}

        </CardDetails>

      </ScrollView>

      {order.status === 'open' &&
        <Button
          title="Encerrar solicitação"
          onPress={handleOrderClose}
          margin={5}
        />}

    </VStack>
  )
}