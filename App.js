import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Input, ListItem } from 'react-native-elements';

const Stack = createStackNavigator();

function TelaLogin({ navigation }) {
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="large"
        source={{ uri: 'https://i.pravatar.cc/150' }}
        containerStyle={styles.avatar}
      />
      <Text>Email</Text>
      <Input />

      <Text>Senha</Text>
      <Input />

      <Button title="Login" onPress={() => navigation.navigate('Lista de Contatos')} />
      <Button title="Cadastre-Se" onPress={() => navigation.navigate('Cadastro do Usuário')} />
    </View>
  );
}

function ListaContatos({ navigation }) {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      axios.get('http://localhost:3000/contatos')
        .then(response => setContatos(response.data))
        .catch(error => console.error('Erro ao buscar contatos:', error));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      {contatos.map((l, i) => (
        <ListItem key={i} bottomDivider onPress={() => navigation.navigate('Edita Contatos', { id: l.id, nome: l.nome, telefone: l.telefone })}>
          <Avatar source={{ uri: l.avatar_url }} />
          <ListItem.Content>
            <ListItem.Title>{l.nome}</ListItem.Title>
            <ListItem.Subtitle>{l.telefone}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Button title="Cadastre Mais Contatos" onPress={() => navigation.navigate('Cadastro de Contatos')} />
    </View>
  );
}

function CadastroUsuario({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <Input />

      <Text>CPF</Text>
      <Input />

      <Text>Email</Text>
      <Input />

      <Text>Senha</Text>
      <Input />

      <Button title="Salvar" onPress={() => { }} />
    </View>
  );
}

function CadastroContato({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const salvarContato = () => {
    const novoContato = {
      nome,
      email,
      telefone,
      avatar_url: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(email || nome)
    };

    axios.post('http://localhost:3000/contatos', novoContato)
      .then(() => navigation.goBack())
      .catch(error => console.error('Erro ao salvar contato:', error));
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <Input value={nome} onChangeText={setNome} />

      <Text>Email</Text>
      <Input value={email} onChangeText={setEmail} />

      <Text>Telefone</Text>
      <Input value={telefone} onChangeText={setTelefone} />

      <Button title="Salvar" onPress={salvarContato} />
    </View>
  );
}

function EditaContato({ navigation, route }) {
  const { id, nome, telefone, email: emailInicial } = route.params;
  const [novoNome, setNovoNome] = useState(nome);
  const [novoTelefone, setNovoTelefone] = useState(telefone);
  const [email, setEmail] = useState(emailInicial || '');

  const alterarContato = () => {
    const contatoAtualizado = {
      nome: novoNome,
      telefone: novoTelefone,
      email,
      avatar_url: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(email || novoNome)
    };

    axios.patch(`http://localhost:3000/contatos/${id}`, contatoAtualizado)
      .then(() => navigation.goBack())
      .catch(error => console.error('Erro ao alterar contato:', error));
  };

  const excluirContato = () => {
    axios.delete(`http://localhost:3000/contatos/${id}`)
      .then(() => navigation.goBack())
      .catch(error => console.error('Erro ao excluir contato:', error));
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <Input value={novoNome} onChangeText={setNovoNome} />

      <Text>Email</Text>
      <Input value={email} onChangeText={setEmail} />

      <Text>Telefone</Text>
      <Input value={novoTelefone} onChangeText={setNovoTelefone} />

      <Button title='Alterar' onPress={alterarContato} />
      <Button title='Excluir' onPress={excluirContato} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Lista de Contatos" component={ListaContatos} />
        <Stack.Screen name="Cadastro de Contatos" component={CadastroContato} />
        <Stack.Screen name="Cadastro do Usuário" component={CadastroUsuario} />
        <Stack.Screen name="Edita Contatos" component={EditaContato} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
