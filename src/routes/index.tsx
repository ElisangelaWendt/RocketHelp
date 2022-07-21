import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import SignIn from '../screens/SignIn'

export function Routes(){

  const [loading, setIsLoading] = useState(true)//se está carregando
  const[user, setUser] = useState<FirebaseAuthTypes.User>()//se o usuário está logado

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  },[])

  if(loading){
    return <Loading/>
  }

  return(
    <NavigationContainer>
      {/* se o usuário existir, levar para o app routes, se não ficar no login */}
      {user ? <AppRoutes/> : <SignIn/> }
    </NavigationContainer>
  )
}