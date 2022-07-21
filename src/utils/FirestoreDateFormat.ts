import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export function DateFormat(timestamp: FirebaseFirestoreTypes.Timestamp){
  //se houver algo no timestamp
  if(timestamp){
    //formatar
    const date = new Date(timestamp.toDate())

    //dia formatado
    const day = date.toLocaleDateString('pt-BR')
    //hora formatada
    const hour = date.toLocaleTimeString('pt-BR')

    //retorna a frase de '(dia) às (horas)'
    return `${day} às ${hour}`;
  }

}