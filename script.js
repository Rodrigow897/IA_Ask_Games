const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const sendForm = (event) => {
    event.preventDefault() //para nao atualizar e reccaregar a pagina ao clicar para enviar o form
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = "Perguntando..."
    askButton.classList.add('loading')
}
form.addEventListener('submit', sendForm) //adiciona um escutador de evento para saber sempre que der um submit