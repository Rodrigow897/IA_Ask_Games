const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

//para formatar o texto da resposta da AI
const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

// Todo o chamado da AI gemini
const askAi = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    let ask = ''

    const askValorant = `## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de jogo, estratégias, builds e dicas

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualisadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nuca responda itens  que vc não tenha certeza de que existe no patch atual.

        ## Reposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo

        ## Exemplo de resposta
        pergunta do usuário: Melhor agente para subir de rank solo
        resposta: O melhor agente atualmente para solo queue é:\n\n **Agente:** Reyna\n\n **Motivo:** Alta capacidade de clutch, cura e snowball. Funciona bem mesmo sem comunicação em equipe.\n\n

        ---
        Aqui está a pergunta do usuario: ${question}`
    
    const askCsgo = `## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de jogo, estratégias, builds e dicas

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualisadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nuca responda itens  que vc não tenha certeza de que existe no patch atual.

        ## Reposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo

        ## Exemplo de resposta
        pergunta do usuário: Melhor posição para segurar a B na Mirage
        resposta: A melhor posição para segurar a B na Mirage é:\n\n **Posição:** Van ou Bench\n\n **Motivo:** Boa visão da entrada, fácil rotação e possibilidade de se reposicionar com segurança.\n\n

        ---
        Aqui está a pergunta do usuario: ${question}`
    
    const askLol = `## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de jogo, estratégias, builds e dicas

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualisadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nuca responda itens  que vc não tenha certeza de que existe no patch atual.

        ## Reposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo

        ## Exemplo de resposta
        pergunta do usuário: Melhor build rengar jungle
        resposta: A build mais atual é: \n\n **Itens:\n\n coloque os intens aqui.\n\n**Runas:\n\n exemplo de runas.\n\n

        ---
        Aqui está a pergunta do usuario: ${question}`

        if (game == 'valorant') {
            ask = askValorant
        } else if (game == 'lol') {
            ask = askLol
        } else if (game == 'csgo') {
            ask = askCsgo
        }


    const contents = [{ //ja na posição[0]
        role: "user",
        parts: [{ //tambem na posição[0]
            text: ask
        }]
    }]

    // inserindo agentes no llm para ele fazer pesquisas no google search e pegar dados atuais
    const tools = [{
        google_search: {}
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
            contents,
            tools
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
        aiResponse.classList.remove('hidden')

    } catch (error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit', sendForm) //adiciona um escutador de evento para saber sempre que der um submit