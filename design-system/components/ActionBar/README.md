Barra fixa no rodapé da tela, com a ação que aquela página existe para provocar.

No celular o paciente lê o procedimento rolando; se a única forma de agendar estivesse no topo, ele teria de voltar. A `action-bar` mantém a ação ao alcance do polegar durante a leitura inteira, e à esquerda dela mostra o estado que dá segurança para apertar: o CEP já confirmado, a primeira data disponível.

**O consumidor fornece:** o rótulo e o valor do estado (ou nada, e a barra fica só com o botão) e a ação do botão.

**Reserve o espaço.** O conteúdo rola por baixo dela, então o contêiner da página leva `app-scroll`, que acrescenta o padding inferior — sem isso, o último parágrafo fica escondido atrás da barra.

**Área segura.** O padding inferior soma `env(safe-area-inset-bottom)`, senão o botão cai sob a barra de gestos do iPhone.

Some a partir de 992px: no desktop a ação vive no cartão lateral fixo.

**Não faça:** duas ações na barra — se houver escolha, o botão abre uma `Sheet`; barra em página de leitura sem conversão; esconder a barra ao rolar (o paciente perde a única saída).
