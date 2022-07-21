import { Box, HStack, Text, useTheme, VStack } from "native-base";
import { IconProps } from "phosphor-react-native";
import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  footer?: string;
  icon: React.ElementType<IconProps>
  children?: ReactNode;//reactNode é um elemento nó 
}

export function CardDetails({
  title,
  description,
  footer = null,
  icon: Icon, //como o icon será usado como componente, precisa estar com a letra maiuscula, então é colocado : e o novo nome da propriedade/componente
  children
}: Props){
  const {colors} = useTheme()

  return(
    <VStack bg="gray.600" p={5} mt={5} rounded="sm" >
      <HStack alignItems="center" mb={4} >
        <Icon color={colors.primary[700]} />
        <Text
        ml={2}
        color="gray.300"
        fontSize="sm"
        textTransform="uppercase"
        >
          {title}
        </Text>
      </HStack>
      {/* colocar duas exclamações na frente da variável faz com que ela se torne booleana, para verificar se há algum conteúdo dentro dela ou não */}
      {/* se a descrição existe renderizar um Text*/}
      {!!description && 
      <Text color="gray.100" fontSize="md" >
        {description}
        </Text>
        }
        {/* para renderizar uma caixa de texto */}
        {children}

        {!!footer && 
        <Box borderTopWidth={1} borderTopColor="gray.400" mt={3} >
          <Text mt={3} color="gray.300" fontSize="sm" >
            {footer}
          </Text>
        </Box>
        }
    </VStack>
  )
}