# Instruções para Configuração

## Requisitos Iniciais

Antes de começar, certifique-se de ter os seguintes requisitos instalados em sua máquina:

1. **Node.js**: Certifique-se de ter o Node.js instalado na sua máquina. Você pode verificar se já possui o Node.js instalado executando o comando:

```javascript
node -v
```

Se o Node.js estiver instalado, você verá a versão instalada. Caso contrário, você precisará instalar o Node.js primeiro.


## Instalação de Dependências

Após garantir que o Node.js esteja instalado:

1. Navegue até o diretório raiz do projeto.
2. Execute o seguinte comando para instalar todas as dependências necessárias:

```javascript
npm install
```


## Configuração do Ambiente

1. **HOSTNAME**: Após a instalação das dependências, você precisará definir o valor da variável `HOSTNAME` no arquivo de configuração. Altere o valor para o IP da sua máquina ou servidor. Por exemplo:
```javascript
const HOSTNAME = '192.168.1.100'; // Altere para o seu IP
```

Por padrão, o serviço está configurado para escutar na porta 6001. Se desejar alterar essa porta, você pode modificar a variável PORT no arquivo de configuração:

```javascript
const PORT = 6001; // Altere para a porta desejada
```