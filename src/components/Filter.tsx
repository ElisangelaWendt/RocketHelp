import { Button, IButtonProps, Text, useTheme } from "native-base"

type FilterProps = IButtonProps & {
  title: string,
  isActive?: boolean;
  type: 'open' | 'close'
}

export function Filter({ title, isActive = false, type, ...rest }: FilterProps) {
  const { colors } = useTheme()

  //se o tipo for igual a aberto
  const colorType = type === "open" ? colors.secondary[700] : colors.green[300];

  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colorType}
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text
      color={isActive ? colorType : "gray.300"}
      fontSize="xs"
      textTransform="uppercase"
      >{title}</Text>
    </Button>
  )
}