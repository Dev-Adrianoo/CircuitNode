



<h1 align="center">CircuitNode</h1>

<p align="center">
Um laboratório de eletrônica virtual e interativo para aprender, prototipar e programar Arduino de forma visual.
</p>

<h2>Visão Geral</h2>

Objetivos

Funcionalidades Planejadas

Escopo do Protótipo (MVP)

Arquitetura e Tecnologias

Como Executar o Projeto

<h3>🚀 Visão Geral do Projeto </h3>
O CircuitNode é uma IDE (Ambiente de Desenvolvimento Integrado) baseada na web, projetada para funcionar como um laboratório de eletrônica virtual e interativo. A plataforma permite que usuários construam circuitos usando nós que se assemelham a componentes de hardware reais (Arduinos, protoboards, LEDs, botões).

A experiência principal é a simulação em tempo real do comportamento do circuito diretamente no navegador. Como funcionalidade secundária, a ferramenta analisa o circuito virtual e traduz (transpila) o fluxograma em código C++ funcional para Arduino, servindo como uma ponte entre a experimentação virtual segura e a aplicação no mundo real.

<h3>🎯 Objetivos Principais</h3>
Permitir a experimentação segura: Oferecer um ambiente sem riscos para montar e testar circuitos.

Fornecer feedback instantâneo: Simular o comportamento lógico dos circuitos em tempo real.

Acelerar a prototipagem: Validar a lógica de um protótipo visualmente antes de montar o hardware.

Democratizar o acesso: Reduzir a curva de aprendizado de eletrônica e programação.

<h3>✨ Funcionalidades Planejadas</h3>
Interface e Canvas
Área de trabalho (canvas) que funciona como um laboratório virtual.

Zoom e Pan (arrastar) no canvas.

Biblioteca de nós com aparência visual que remeta ao hardware real.

Capacidade de arrastar e soltar nós no canvas.

Nós e Conexões
Pontos de conexão (pinos) interativos em cada nó.

Conexões representadas visualmente como "cabos virtuais".

Capacidade de deletar nós e conexões.

Criação de "sub-circuitos" (ex: um "Nó de Protoboard").

Modo Simulação (Experiência Principal)
Execução da lógica do circuito em tempo real no navegador.

Nós de entrada (Interruptor, Sensores) interativos.

Visualização do fluxo de sinal lógico (HIGH/LOW) através dos cabos.

Nós de saída (LEDs) que refletem seu estado visualmente.

Modo Geração de Código (Ponte para o Real)
Tradução do grafo visual em código C++ para Arduino.

Painel para exibir e copiar o código gerado.

(Avançado) Compilação e envio do código para uma placa conectada via USB.

Gerenciamento de Projetos
Contas de usuário e autenticação.

Salvamento de projetos na nuvem.

Carregamento e edição de projetos salvos.

<h3>🏆 Escopo do Protótipo (MVP - 2 Semanas)</h3>
Nosso foco principal é na experiência de simulação interativa.

<h3>✅ Recursos INCLUÍDOS no MVP:</h3>
Interface e Nós Visuais:

Um canvas funcional com React Flow.

Biblioteca com 3 nós essenciais com design simplificado:

[ENTRADA] Nó de Interruptor: Componente clicável que alterna sua saída (HIGH/LOW).

[LÓGICA] Nó NOT: Bloco lógico que inverte o sinal recebido.

[SAÍDA] Nó de LED: Componente que muda sua aparência (cor) com base na entrada.

Simulação Interativa:

Conexão dos nós com "cabos virtuais".

Execução da lógica em tempo real no navegador (clicar no Interruptor muda o estado do LED).

Geração de Código:

Botão "Gerar Código" que traduz o cenário simulado para C++ de Arduino.

Painel para exibir o código gerado.

<h3>❌ Recursos EXCLUÍDOS do MVP:</h3>
Zoom e Pan, nós de Protoboard, contas de usuário, salvamento de projetos.

Aparência de hardware realista nos nós (usaremos um design funcional).

Envio direto para a placa (usaremos o simulador Wokwi para testar o código gerado).

<h3>🏗️ Arquitetura e Tecnologias</h3>
Estrutura: Monorepo contendo frontend e backend.

Lógica Principal: A simulação e a geração de código acontecem no front-end (client-side).

Linguagem Alvo: O código gerado é em C++ para Arduino.

<h3>🛠️ Pilha de Tecnologias</h3>
Front-end:

React (com Vite)

React Flow (para a interface de nós)

TailwindCSS (para estilização)

Back-end:

Node.js (com TypeScript)

Express.js (para a API)

Banco de Dados (Pós-MVP):

PostgreSQL

Ambiente de Desenvolvimento:

Docker e Docker Compose

 
<h2>Como Executar o Projeto ?</h2>

Clone o repositório:

git clone [URL_DO_SEU_REPOSITORIO]

cd CircuitNode

Suba os contêineres Docker:

docker-compose up -d --build

<h3>Acesse a aplicação:</h3>

O front-end estará disponível em http://localhost:5173.

O back-end estará disponível em http://localhost:3000.
