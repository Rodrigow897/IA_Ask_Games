const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}
// AIzaSyBS_gPfmyrUCzsT4_eGhYL_wlQ5hF8Y82o
const askAi = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const ask = `
        olha, tenho esse jogo ${game} e queria saber ${question}
    `
    const contents = [{ //ja na posição[0]
        parts: [{ //tambem na posição[0]
            text: ask
        }]
    }]

    //chamada API
    const response = await fetch(geminiURL, {
        //uma chamada HTTP via API, é preciso de um metodo
        method: 'POST',
        // tambem é preciso definir os cabeçalhos
        headers: {
            'Content-Type': 'application/json'
        },
        // e no corpo é preciso mandar um JSON
        body: JSON.stringify({ //para mandar um JSON e transformar um obj js inteiro num JSON, é usado o stringfy()
            contents
        })
    })

    // o resultado do fetch precisa ser aguardado e transformado em json()
    const data = await response.json()
    return data.candidates[0].content.parts[0].text //chegar ate o texto da resposta da AI
}

const sendForm = async (event) => {
    event.preventDefault() //para nao atualizar e recaregar a pagina ao clicar para enviar o form
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

    try {
        //perguntar para a IA
        const text = await askAi(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)

    } catch (error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit', sendForm) //adiciona um escutador de evento para saber sempre que der um submit