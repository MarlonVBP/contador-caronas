# 🚗 CaronaCount

O **CaronaCount** é uma aplicação web moderna e responsiva (Mobile-First) projetada para auxiliar no gerenciamento e contagem de caronas. Ele permite que você registre caronas completas, meias caronas, controle descontos ou gastos diários, e gerencie ciclos de faturamento ("fechamentos"), tudo em uma interface de calendário elegante e intuitiva.

## ✨ Funcionalidades

- **Controle Diário de Caronas:** Registre rapidamente a quantidade de *Caronas Completas* e *Meias Caronas* para qualquer dia do mês.
- **Configuração de Preços Dinâmica:** Defina e altere facilmente o valor cobrado por cada tipo de carona na aba de configurações. O saldo global será recalculado de forma retroativa.
- **Registro de Descontos e Gastos:** Adicione valores de descontos ou gastos diários acompanhados de um motivo justificativo (ex: corrida de aplicativo, falta, gasolina).
- **Feedback Visual Dinâmico:** Os dias no calendário mudam de cor com base nos seus registros, para facilitar a visualização mensal:
  - 🟣 **Violeta:** Apenas Caronas Completas.
  - 🌺 **Fúcsia (Rosa):** Apenas Meias Caronas.
  - 🌌 **Degradê (Violeta e Fúcsia):** Caronas Completas e Meias no mesmo dia.
  - ⚪ **Cinza:** Apenas descontos ou gastos registrados no dia.
- **Gestão de Fechamento de Período:** Marque um dia específico como "Dia de Fechamento". O sistema calcula automaticamente o valor exato acumulado apenas daquele ciclo específico.
- **Saldo Atual Inteligente:** Visualize na tela principal o saldo real em aberto. Se o dia atual for o dia do fechamento, o aplicativo exibe inteligentemente o total final gerado naquele ciclo.
- **Persistência de Dados (Offline):** Todos os dados e configurações são salvos automaticamente no `LocalStorage` do navegador, garantindo que nada se perca ao fechar ou recarregar a aba, e mantendo sua privacidade local.

## 💻 Tecnologias Utilizadas

A aplicação foi desenvolvida utilizando tecnologias nativas do front-end, garantindo altíssima performance, fluidez, e zero necessidade de servidores complexos:

- **HTML5:** Semântica estrutural dos componentes e modais (Bottom Sheets).
- **CSS3 (Vanilla):** Estilização avançada com Flexbox, CSS Grid, Variáveis globais, Glassmorphism e gradientes modernos baseados em designs premium (como o estilo *Paymark*).
- **JavaScript (Vanilla):** Motor lógico responsável pelo cálculo dos saldos, manipulação de estado, injeção dinâmica de datas no calendário e ponte com a API de Web Storage.
- **[Phosphor Icons](https://phosphoricons.com/):** Conjunto de ícones leves importados via CDN para uma interface consistente.
- **Google Fonts (Inter):** Tipografia padrão-ouro da indústria, entregando ótima legibilidade e acabamento profissional.

## 🚀 Como Executar o Projeto

Como o projeto é construído estritamente com arquivos estáticos, não há necessidade de instalação de pacotes npm, dependências, ou build.

1. Clone o repositório para o seu ambiente local ou faça o download dos arquivos.
   ```bash
   git clone <url-do-repositorio>
   ```
2. Navegue até o diretório raiz do projeto.
3. Abra o arquivo `index.html` em qualquer navegador web atual (Google Chrome, Firefox, Safari, Edge).

*Dica para desenvolvedores: Para testar a responsividade diretamente pelo celular, utilize uma extensão como o **Live Server** (no VS Code) para hospedar a aplicação na sua rede Wi-Fi local.*

## 📱 Guia de Uso

1. **Configuração Inicial:** Ao iniciar o aplicativo, clique no botão de engrenagem (⚙️) no canto superior direito para acessar as **Configurações**. Defina os valores em R$ para "Carona Completa" e "Meia Carona" e salve.
2. **Lançamento de Dados:** Pelo calendário principal, escolha a data onde deseja incluir um registro. Uma janela (Bottom Sheet) subirá; clique nos botões `+` e `-` para assinalar a quantidade de caronas e preencha descontos se houver. Pressione **"Salvar Registro"**.
3. **Fechamento de Caixa:** Chegou o dia de realizar o balanço financeiro e efetuar ou receber pagamentos? Abra o dia em questão, ative a chave **"Marcar como Fechamento"** e salve. O dashboard será zerado e contabilizará novos ganhos a partir do dia seguinte.

## 📂 Estrutura de Arquivos

```text
📁 contador-caronas
├── 📄 index.html    # Estrutura do app, formulários e esqueletos do calendário
├── 📄 style.css     # Design System com o layout e paleta Dark Theme
├── 📄 script.js     # Lógica do app, calculadoras de valores e integração com LocalStorage
└── 📄 README.md     # Documentação do projeto
```

---
*Desenvolvido com o objetivo de simplificar o dia a dia e automatizar contas! 🚗💨*