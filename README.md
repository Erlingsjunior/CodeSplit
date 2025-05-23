# 🚀 CodeSplit

> **Lógica, fluxo de código e abstração de uma forma que você nunca viu.**

<div align="center">

![CodeSplit Logo](https://via.placeholder.com/400x200/1a1a1a/00d4ff?text=CodeSplit)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

[🌟 **Dê uma estrela!**](https://github.com/Erlingsjunior/CodeSplit) | [📋 Documentação](#-funcionalidades) | [🤝 Contribuir](#-como-contribuir) | [💬 Contato](#-contato)

</div>

---

## 🎯 **Sobre o Projeto**

**CodeSplit** é uma revolução na forma como desenvolvemos software. Criado por **Erling Sriubas Junior**, especialista em frontend web/mobile no ecossistema React/Next.js e Design System Engineer, este projeto nasceu da necessidade de **visualizar, entender e manipular código de forma intuitiva**.

### 🧠 **A Visão**

Imagine um mundo onde:
- ✨ **Código vira arte visual** - Funções, estados e efeitos se tornam cartões interativos
- 🔄 **Debug é instantâneo** - Clique no código, veja o card. Clique no card, vá para o código
- 🎯 **Abstração é simples** - Componentes complexos viram peças de lego reutilizáveis
- 🚀 **Colaboração é fluida** - Sua equipe entende o código em segundos, não em horas

**CodeSplit não é apenas um editor. É uma nova forma de pensar código.**

---

## ⚡ **Funcionalidades**

### 🎨 **Parser Inteligente**
```typescript
// Seu código vira isto automaticamente:
function fetchUserData() { /* ... */ }    // 📦 Card: fetchUserData
const [users, setUsers] = useState([]);   // 🔄 Card: users (state)
useEffect(() => { /* ... */ }, []);       // ⚡ Card: effect
```

### 🏷️ **Marcadores Customizados**
```typescript
// #card authentication
const loginUser = async (credentials) => {
  // Lógica de autenticação
  return authenticateUser(credentials);
};
// #end

// @card validation  
const validateForm = (data) => {
  return schema.parse(data);
};
// @end
```

### 🔗 **Sincronização Bidirecional**
- 👆 **Click no código** → Seleciona o card correspondente
- 👆 **Click no card** → Destaca o código na tela
- 🎯 **Navegação instantânea** entre abstração e implementação

### 📚 **Biblioteca de Componentes**
- 💾 **Salve cards** na sua biblioteca pessoal
- 🔄 **Reutilize código** entre projetos
- 🎨 **Crie templates** completos (component + types + tests + stories)

### 🧬 **Análise de Dependências**
- 📊 **Visualize fluxo de dados** entre componentes
- ⚠️ **Detecte problemas** automaticamente
- 🔍 **Mapeie relacionamentos** complexos

---

## 🛠️ **Tecnologias**

<div align="center">

| Frontend | State | Testing | Docs | Validation |
|----------|-------|---------|------|------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js) | ![Zustand](https://img.shields.io/badge/Zustand-2D3748?logo=zustand) | ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest) | ![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook) | ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod) |
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react) | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript) | ![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?logo=testing-library) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css) | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint) |

</div>

### 🎯 **Por que essas tecnologias?**

- **Next.js 14** - Performance e SSR de última geração
- **TypeScript + Zod** - Type safety completa, do schema ao runtime
- **Zustand** - Estado global simples e performático
- **Tailwind CSS** - Design system escalável e customizável
- **Storybook** - Documentação viva e desenvolvimento isolado
- **Jest + Testing Library** - Testes confiáveis e manuteníveis

---

## 🚀 **Quick Start**

```bash
# Clone o repositório
git clone https://github.com/Erlingsjunior/CodeSplit.git

# Entre na pasta
cd CodeSplit

# Instale as dependências
npm install

# Inicie o desenvolvimento
npm run dev

# Ou veja a documentação interativa
npm run storybook
```

**🎉 Pronto! Abra [http://localhost:3000](http://localhost:3000) e comece a dividir código!**

---

## 🎨 **Como Usar**

### 1. **Escreva código normal**
```typescript
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
};
```

### 2. **Veja a mágica acontecer**
O CodeSplit automaticamente cria:
- 📦 **Card "UserProfile"** (componente)
- 🔄 **Card "user"** (estado)
- ⚡ **Card "fetchUser effect"** (efeito)

### 3. **Interaja visualmente**
- Click nos cards para navegar
- Arraste para reorganizar
- Salve na biblioteca para reutilizar

---

## 🤝 **Como Contribuir**

Adoramos contribuições! Veja como participar:

### 🐛 **Reportar Bugs**
Abra uma [issue](https://github.com/Erlingsjunior/CodeSplit/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Screenshots se possível

### ✨ **Sugerir Features**
- Fork o projeto
- Crie sua branch: `git checkout -b feature/MinhaFeature`
- Commit suas mudanças: `git commit -m 'Add: MinhaFeature'`
- Push para a branch: `git push origin feature/MinhaFeature`
- Abra um Pull Request

### 📋 **To-Do List**
- [ ] 🎨 Syntax highlighting avançado
- [ ] 🔌 Plugin para VS Code
- [ ] 🌐 Colaboração em tempo real
- [ ] 📱 Versão mobile
- [ ] 🤖 IA para sugestões de refatoração

---

## 💎 **Doações e Parcerias**

**CodeSplit** é open source e sempre será! Mas se você quer ajudar a acelerar o desenvolvimento:

### 💰 **Doações**
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/erlingjunior)
- 💳 PIX: `+55 11 995682825`

### 🤝 **Parcerias**
Interessado em parceria comercial ou patrocínio? Entre em contato!

### 🏢 **Para Empresas**
- 📈 Licenciamento enterprise
- 🎯 Features customizadas
- 🛠️ Suporte dedicado
- 📚 Treinamentos para equipes

---

## 📞 **Contato**

<div align="center">

### **Erling Sriubas Junior**
*Frontend Expert & Design System Engineer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/erling-sriubas-972696128/)

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Erlingsjunior)

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:erlingjunior@gmail.com)

**📧 erlingjunior@gmail.com**

*Propostas comerciais, parcerias e colaborações são sempre bem-vindas!*

</div>

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

--- 

<div align="center">

### 🌟 **Se gostou do projeto, dê uma estrela!**

[![Star History Chart](https://api.star-history.com/svg?repos=Erlingsjunior/CodeSplit&type=Date)](https://star-history.com/#Erlingsjunior/CodeSplit&Date)

**Feito com ❤️ e muito ☕ por [Erling Sriubas Junior](https://github.com/Erlingsjunior)**

</div>

          ----------------------- ON EGLISH -----------------------

# 🚀 CodeSplit (English)

> **Logic, code flow and abstraction like you've never seen before.**

<div align="center">

![CodeSplit Logo](https://via.placeholder.com/400x200/1a1a1a/00d4ff?text=CodeSplit)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

[🌟 **Give us a star!**](https://github.com/Erlingsjunior/CodeSplit) | [📋 Documentation](#-features) | [🤝 Contribute](#-how-to-contribute) | [💬 Contact](#-contact)

</div>

---

## 🎯 **About the Project**

**CodeSplit** is a revolution in how we develop software. Created by **Erling Sriubas Junior**, a frontend web/mobile specialist in the React/Next.js ecosystem and Design System Engineer, this project was born from the need to **visualize, understand and manipulate code intuitively**.

### 🧠 **The Vision**

Imagine a world where:
- ✨ **Code becomes visual art** - Functions, states and effects become interactive cards
- 🔄 **Debug is instant** - Click on code, see the card. Click on card, go to code
- 🎯 **Abstraction is simple** - Complex components become reusable lego pieces
- 🚀 **Collaboration is fluid** - Your team understands code in seconds, not hours

**CodeSplit isn't just an editor. It's a new way of thinking about code.**

---

## ⚡ **Features**

### 🎨 **Smart Parser**
```typescript
// Your code automatically becomes this:
function fetchUserData() { /* ... */ }    // 📦 Card: fetchUserData
const [users, setUsers] = useState([]);   // 🔄 Card: users (state)
useEffect(() => { /* ... */ }, []);       // ⚡ Card: effect
```

### 🏷️ **Custom Markers**
```typescript
// #card authentication
const loginUser = async (credentials) => {
  // Authentication logic
  return authenticateUser(credentials);
};
// #end

// @card validation  
const validateForm = (data) => {
  return schema.parse(data);
};
// @end
```

### 🔗 **Bidirectional Synchronization**
- 👆 **Click on code** → Selects corresponding card
- 👆 **Click on card** → Highlights code on screen
- 🎯 **Instant navigation** between abstraction and implementation

### 📚 **Component Library**
- 💾 **Save cards** to your personal library
- 🔄 **Reuse code** across projects
- 🎨 **Create complete templates** (component + types + tests + stories)

### 🧬 **Dependency Analysis**
- 📊 **Visualize data flow** between components
- ⚠️ **Detect issues** automatically
- 🔍 **Map complex relationships**

---

## 🛠️ **Technologies**

<div align="center">

| Frontend | State | Testing | Docs | Validation |
|----------|-------|---------|------|------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js) | ![Zustand](https://img.shields.io/badge/Zustand-2D3748?logo=zustand) | ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest) | ![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook) | ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod) |
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react) | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript) | ![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?logo=testing-library) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css) | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint) |

</div>

### 🎯 **Why these technologies?**

- **Next.js 14** - Latest generation performance and SSR
- **TypeScript + Zod** - Complete type safety, from schema to runtime
- **Zustand** - Simple and performant global state
- **Tailwind CSS** - Scalable and customizable design system
- **Storybook** - Living documentation and isolated development
- **Jest + Testing Library** - Reliable and maintainable tests

---

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/Erlingsjunior/CodeSplit.git

# Enter the folder
cd CodeSplit

# Install dependencies
npm install

# Start development
npm run dev

# Or see interactive documentation
npm run storybook
```

**🎉 Ready! Open [http://localhost:3000](http://localhost:3000) and start splitting code!**

---

## 🤝 **How to Contribute**

We love contributions! Here's how to participate:

### 🐛 **Report Bugs**
Open an [issue](https://github.com/Erlingsjunior/CodeSplit/issues) with:
- Clear problem description
- Steps to reproduce
- Screenshots if possible

### ✨ **Suggest Features**
- Fork the project
- Create your branch: `git checkout -b feature/MyFeature`
- Commit your changes: `git commit -m 'Add: MyFeature'`
- Push to branch: `git push origin feature/MyFeature`
- Open a Pull Request

---

## 💎 **Donations and Partnerships**

**CodeSplit** is open source and always will be! But if you want to help accelerate development:

### 💰 **Donations**
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/erlingjunior)
- 💳 PIX: `+55 11 995682825`

### 🤝 **Partnerships**
Interested in commercial partnership or sponsorship? Get in touch!

---

## 📞 **Contact**

<div align="center">

### **Erling Sriubas Junior**
*Frontend Expert & Design System Engineer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/erling-sriubas-972696128/)

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Erlingsjunior)

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:erlingjunior@gmail.com)

**📧 erlingjunior@gmail.com**

*Commercial proposals, partnerships and collaborations are always welcome!*

</div>

---

## 📄 **License**

This project is under the MIT license. See the [LICENSE](./LICENSE) file for more details.

---

<div align="center">

### 🌟 **If you liked the project, give it a star!**

**Made with ❤️ and lots of ☕ by [Erling Sriubas Junior](https://github.com/Erlingsjunior)**

</div>

