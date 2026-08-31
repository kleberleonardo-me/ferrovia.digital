
window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 50;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

function getCurrentTime() {
  // Obter a data e hora atual
  const date = new Date();

  // Obter o fuso horário do navegador
  const options = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: '2-digit',
    minute: '2-digit',
  };

  // Formatar a data e hora no fuso horário local
  const localTime = date.toLocaleTimeString('pt-BR', options);

  // Obter a hora atual
  const hours = parseInt(localTime.split(':')[0]);

  // Definir a saudação
  let greeting;
  if (hours >= 5 && hours < 12) {
    greeting = 'Tenha um excelente dia!';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Tenha uma ótima tarde!';
  } else {
    greeting = 'Que você continue vencendo amanhã. Boa noite!';
  }

  // Retornar a saudação
  return greeting;
}

// Exemplo de uso
const greeting = getCurrentTime();

console.log(greeting); // Exibe a saudação "Tenha um bom dia!", "Boa tarde!" ou "Boa noite!"


var messages = [
    'Olá! 🙋🏻 Sou o Kleber.',
    'Você esperou essa linha mudar,',
    'né? ⏱️',
    'É exatamente isso que faço:',
    'construo uma vitrine digital',
    'que prende a atenção e obriga',
    'o seu visitante a olhar',
    'para o que você mais vende.',
    'Copio o seu site atual,',
    'reformulo a estrutura,',
    'e entrego pronto no seu novo domínio.',
    'Sem complicação.',
    'Investimento único: R$ 1.250.',
    getCurrentTime(),
    '<a href="https://wa.me/5511959360936?text=Ol%C3%A1%2C%20Kleber!%20Li%20sua%20mensagem%20no%20site%20e%20quero%20reestruturar%20meu%20site%20para%20o%20novo%20dom%C3%ADnio%20por%20R%24%201.250." target="_blank" style="color: inherit; text-decoration: underline;">Toque aqui e vamos conversar 👇🏻</a>',
];


  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
