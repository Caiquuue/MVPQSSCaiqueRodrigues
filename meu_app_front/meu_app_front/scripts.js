/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
var idprofissional;

// Crie uma variável para armazenar os IDs dos profissionais já adicionados
const addedProfessionalIds = new Set();

const getList = async () => {
  let url = 'http://127.0.0.1:5000/profissionais';
  try {
    const response = await fetch(url);
    const data = await response.json();

    const knowledgePromises = data.Profissionais.map(async (item) => {
      const knowledgeResponse = await fetch(`http://127.0.0.1:5000/conhecimentoPorID?id_profissional=${item.id}`);
      const knowledgeData = await knowledgeResponse.json();
      const knowledgeNames = knowledgeData.Conhecimentos.map(knowledge => knowledge.nome).join(", ");

      return {
        ...item,
        knowledgeNames
      };
    });

    const professionals = await Promise.all(knowledgePromises, postItem);
    professionals.forEach(item => {
      idprofissional = item.id;
      // Verificar se o ID do profissional já foi adicionado
      if (!addedProfessionalIds.has(item.id)) {
        insertList(item.nome, item.celular, item.email, item.anos_experiencia, item.categoria, item.knowledgeNames, item.id);

        // Adicionar o ID do profissional ao conjunto de profissionais já adicionados
        addedProfessionalIds.add(item.id);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
};



/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputPrfessional, inputPhone, inputEmail, inputExperiencia) => {
  const formData = new FormData();
  formData.append('nome', inputPrfessional);
  formData.append('celular', inputPhone);
  formData.append('email', inputEmail);
  formData.append('anos_experiencia', inputExperiencia)

  let url = 'http://127.0.0.1:5000/profissional';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem, idprofissional)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item, id) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/profissional?nome=' + item;
  fetch(url, {
    method: 'delete'
  })

  .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });

   // Remover o conhecimento associado ao profissional
   let conhecimentoUrl = 'http://127.0.0.1:5000/conhecimento?id_profissional=' + id;
   fetch(conhecimentoUrl, {
     method: 'delete'
   })
     .then((response) => response.json())
     .then(() => {
       // Remover a linha da tabela
       const row = document.getElementById(`row_${item}`);
       if (row) {
         row.remove();
         alert("Removido!");
       }
       fetchListaConhecimentos ();
     })  
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputPhone = document.getElementById("newPhone").value;
  let inputEmail = document.getElementById("newEmail").value;
  let inputExperiencia = document.getElementById("newExperience").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um Profissional!");
  } else if (inputExperiencia === ''){
    alert("Escreva o número de anos de experiência!");
  } else if (!isValidEmail(inputEmail)) {
    alert("Insira um e-mail válido!");
  } else if (!isValidPhone(inputPhone)) {
    alert("Insira um telefone válido!");
  } else {
    getList();
    postItem(inputProduct, inputPhone, inputEmail, inputExperiencia);
    alert("Profissional adicionado!");
  }
};

function isValidPhone(phone) {
  // Expressão regular para validar telefone no formato 99 99999 9999
  const phoneRegex = /^\d{2} \d{5} \d{4}$/;
  return phoneRegex.test(phone);
}

function isValidEmail(email) {
  // Expressão regular para validar e-mails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Aplicar máscara no campo de telefone
document.addEventListener("DOMContentLoaded", function() {
  var phoneInput = document.getElementById('newPhone');
  var cleave = new Cleave(phoneInput, {
    phone: true,
    phoneRegionCode: 'BR'
    
  });
});



/*
--------------------------------------------------------------------------------------
Função para inserir items na lista apresentada
--------------------------------------------------------------------------------------
*/
const insertList = (nameProfessional, phone, email, anos_experiencia, categoria, knowledge, professionalId) => {
  const item = [nameProfessional, phone, email, anos_experiencia,categoria, knowledge];
  const table = document.getElementById('myTable');
  const row = table.insertRow();

  row.id = `row_${professionalId}`;

  for (let i = 0; i < item.length; i++) {
    const cell = row.insertCell(i);
    cell.textContent = item[i];
  }

  insertButton(row.insertCell(-1));
  createAddKnowledgeColumn(row, professionalId);

  document.getElementById('newInput').value = '';
  document.getElementById('newPhone').value = '';
  document.getElementById('newEmail').value = '';
  document.getElementById('newExperience').value = '';
  

  removeElement();
};
/*
--------------------------------------------------------------------------------------
Função para criar a coluna com o botão "Adicionar Conhecimento"
--------------------------------------------------------------------------------------
*/
// Lista dos 50 conhecimentos disponíveis
const conhecimentosPossiveis = [
  'Testes Automatizados', 'Selenium', 'JUnit', 'TestNG', 'Cucumber', 'TDD', 'BDD', 
  'Testes de Regressão', 'Testes de Performance', 'Testes de Carga', 'Testes de Segurança', 
  'Postman', 'SoapUI', 'Testes de Usabilidade', 'Testes Funcionais', 'PMBOK', 'Scrum Master', 
  'Kanban', 'Gestão de Riscos', 'Gestão de Escopo', 'Gestão de Tempo', 'Gestão de Custos', 
  'Gestão de Qualidade', 'Gestão de Pessoas', 'Gestão de Stakeholders', 'MS Project', 
  'Jira', 'Trello', 'Scrum', 'Lean', 'SAFE', 'XP', 'Gestão Ágil', 'MVP', 
  'User Stories', 'OKRs', 'CICD', 'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 
  'Vue.js', 'TypeScript', 'Bootstrap', 'Java', 'Python', 'Node.js', 'Spring Boot', 
  'Django', 'Ruby on Rails', 'SQL', 'NoSQL', 'Microservices', 'RESTful APIs'
];

// Função para criar a coluna com o dropdown de conhecimento e botão "Adicionar Conhecimento"
const createAddKnowledgeColumn = (row, professionalId) => {
// Criar o dropdown (select) de conhecimentos
const knowledgeSelect = document.createElement('select');
knowledgeSelect.id = `knowledge-select-${professionalId}`;

// Populando o dropdown com os conhecimentos
conhecimentosPossiveis.forEach(conhecimento => {
  const option = document.createElement("option");
  option.value = conhecimento;
  option.textContent = conhecimento;
  knowledgeSelect.appendChild(option);
});

// Criar o botão de adicionar conhecimento
const addKnowledgeButton = document.createElement('button');
addKnowledgeButton.textContent = 'Adicionar Conhecimento';
addKnowledgeButton.addEventListener('click', () => {
  addKnowledge(professionalId);
});

// Inserir o dropdown e o botão na célula da linha
const actionCell = row.insertCell(-1);
actionCell.appendChild(knowledgeSelect);
actionCell.appendChild(addKnowledgeButton);
};



/*
--------------------------------------------------------------------------------------
Função para adicionar um conhecimento ao profissional
--------------------------------------------------------------------------------------
*/
const addKnowledge = async (professionalId) => {
  const knowledgeSelect = document.getElementById(`knowledge-select-${professionalId}`);
  const selectedKnowledge = knowledgeSelect.value; // Pega o conhecimento selecionado da lista

  if (selectedKnowledge !== "") {
    const knowledgeLevel = prompt('Digite o nível de conhecimento (1-5):'); // Prompt para o nível de conhecimento

    if (knowledgeLevel !== null && !isNaN(knowledgeLevel) && knowledgeLevel >= 1 && knowledgeLevel <= 5) {
      const formData = new FormData();
      formData.append('id_profissional', professionalId);
      formData.append('nome', selectedKnowledge);
      formData.append('nivel_conhecimento', knowledgeLevel); // Adiciona o nível de conhecimento ao FormData

      let url = 'http://127.0.0.1:5000/conhecimento';
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Atualiza a tabela de conhecimentos na linha correspondente ao profissional
        const row = document.getElementById(`row_${professionalId}`);
        const knowledgeCell = row.cells[5]; // Verifique se essa célula é a correta para conhecimentos
        if (knowledgeCell.textContent === '') {
          knowledgeCell.textContent = selectedKnowledge;
        } else {
          knowledgeCell.textContent += `, ${selectedKnowledge}`;
        }
        alert('Conhecimento adicionado!');
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert('Por favor, insira um nível de conhecimento válido entre 1 e 5.');
    }
  } else {
    alert('Por favor, selecione um conhecimento.');
  }
};
/*
--------------------------------------------------------------------------------------
Função para preencher a lista suspensa com os dados recebidos
--------------------------------------------------------------------------------------
*/

let fetchListaConhecimentos;
document.addEventListener("DOMContentLoaded", function() {

  const dataList = document.getElementById("data-list");
  const searchBtn = document.getElementById("search-btn");
  const professionalsList = document.getElementById("professionals-list");

const preencherListaSuspensa = (conhecimentos) => {
  dataList.innerHTML = "";
  conhecimentos.forEach((conhecimento) => {
    const option = document.createElement("option");
    option.value = conhecimento.nome;
    option.textContent = conhecimento.nome;
    dataList.appendChild(option);
  });
};

/*
--------------------------------------------------------------------------------------
Função para buscar os profissionais de acordo com o conhecimento selecionado
--------------------------------------------------------------------------------------
*/


  const buscarProfissionais = (selectedKnowledge) => {
    fetch("http://127.0.0.1:5000/profissional?nome=" + selectedKnowledge)
      .then((response) => response.json())
      .then((data) => {
        const professionalsListBody = document.getElementById("professionals-list-body");
        professionalsListBody.innerHTML = ""; // Limpar o conteúdo anterior da tabela
  
        data.Profissionais.forEach((professional) => {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          const categoriaCell = document.createElement("td");
          const phoneCell = document.createElement("td");
          const emailCell = document.createElement("td");
  
          nameCell.textContent = professional.nome;
          categoriaCell.textContent = professional.categoria;
          phoneCell.textContent = professional.celular;
          emailCell.textContent = professional.email;

  
          row.appendChild(nameCell);
          row.appendChild(categoriaCell);
          row.appendChild(phoneCell);
          row.appendChild(emailCell);
          
  
          professionalsListBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
--------------------------------------------------------------------------------------
Fazer a solicitação à API para obter a lista de conhecimentos
--------------------------------------------------------------------------------------
*/

  fetchListaConhecimentos = () => {
    fetch("http://127.0.0.1:5000/conhecimentos")
      .then((response) => response.json())
      .then((data) => {
        preencherListaSuspensa(data.Conhecimentos);
      })
      .catch((error) => {
        console.log(error);
      });
  };



/*
--------------------------------------------------------------------------------------
Função para fazer a solicitação à API de notícias
--------------------------------------------------------------------------------------
*/
function buscarNoticias(selectedKnowledge) {
  const apiKey = "d634613f307440bdafb8ae55d43edf4e";
  const apiUrl = `https://api.bing.microsoft.com/v7.0/news/search?q=${selectedKnowledge}`;
  const noticiasContainer = document.querySelector(".noticias");

  noticiasContainer.innerHTML = "";

  fetch(apiUrl, {
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.value && data.value.length > 0) {
        const noticias = data.value;

        noticias.forEach(noticia => {
          const noticiaDiv = document.createElement("div");
          noticiaDiv.classList.add("noticia");

          const titulo = document.createElement("h2");
          titulo.textContent = noticia.name;
          titulo.classList.add("noticia-titulo");

          const descricao = document.createElement("p");
          descricao.textContent = noticia.description;
          descricao.classList.add("noticia-descricao");

          const link = document.createElement("a");
          link.href = noticia.url; // Define o URL do link como o URL da notícia
          link.textContent = "Leia mais"; // Texto do link (pode ser personalizado)
          link.classList.add("noticia-link");

          noticiaDiv.appendChild(titulo);
          noticiaDiv.appendChild(descricao);
          noticiaDiv.appendChild(link); // Adiciona o link à div da notícia

          noticiasContainer.appendChild(noticiaDiv);
        });
      }
    })
    .catch(error => {
      console.error("Erro na solicitação:", error);
    });
}

/*
--------------------------------------------------------------------------------------
Ouvinte de eventos para o botão de pesquisa
--------------------------------------------------------------------------------------
*/
searchBtn.addEventListener("click", () => {
  const selectedKnowledge = dataList.value;
  buscarProfissionais(selectedKnowledge);
  buscarNoticias(selectedKnowledge);
});
fetchListaConhecimentos();
});
