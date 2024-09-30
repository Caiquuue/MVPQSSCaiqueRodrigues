import pandas as pd
import pytest
from model import *  # Modelos que você já tem

# Instanciação das Classes
carregador = Carregador()
avaliador = Avaliador()
modelo = Model()
preprocessador = PreProcessador()  # Instancia o PreProcessador

# Parâmetros    
url_dados = "./MachineLearning/data/profissionais_dataset.csv"
colunas = ['id_profissional', 'anos_experiencia', 'Testes Automatizados', 'Selenium', 'JUnit', 'TestNG', 'Cucumber',
           'TDD', 'BDD', 'Testes de Regressão', 'Testes de Performance', 'Testes de Carga', 'Testes de Segurança',
           'Postman', 'SoapUI', 'Testes de Usabilidade', 'Testes Funcionais', 'PMBOK', 'Scrum Master', 'Kanban',
           'Gestão de Riscos', 'Gestão de Escopo', 'Gestão de Tempo', 'Gestão de Custos', 'Gestão de Qualidade',
           'Gestão de Pessoas', 'Gestão de Stakeholders', 'MS Project', 'Jira', 'Trello', 'Scrum', 'Lean', 'SAFE',
           'XP', 'Gestão Ágil', 'MVP', 'User Stories', 'OKRs', 'CICD', 'HTML', 'CSS', 'JavaScript', 'React', 'Angular',
           'Vue.js', 'TypeScript', 'Bootstrap', 'Java', 'Python', 'Node.js', 'Spring Boot', 'Django', 'Ruby on Rails',
           'SQL', 'NoSQL', 'Microservices', 'RESTful APIs', 'categoria']

# Carga dos dados
dataset = carregador.carregar_dados(url_dados)

# Pré-processamento: aplica o escalonamento nos dados de entrada
X = dataset.drop(columns=['categoria'])  # Remover a coluna alvo
y = dataset['categoria']  # Definir a coluna alvo
X_scaled = preprocessador.escalonar(X)  # Aplicar o escalonamento nos dados de entrada

# Teste para o modelo Decision Tree
def test_modelo_decision_tree():
    dt_path = './MachineLearning/Models/cart_model.pkl'
    modelo_dt = modelo.carrega_modelo(dt_path)
    
    acuracia_dt = avaliador.avaliar(modelo_dt, X_scaled, y)
    assert acuracia_dt >= 0.80  # Ajuste conforme necessário

# Teste para o modelo SVM
def test_modelo_svm():
    svm_path = './MachineLearning/Models/svm_model.pkl'
    modelo_svm = modelo.carrega_modelo(svm_path)
    
    acuracia_svm = avaliador.avaliar(modelo_svm, X_scaled, y)
    assert acuracia_svm >= 0.80  # Ajuste conforme necessário

# Teste para o modelo KNN
def test_modelo_knn():
    knn_path = './MachineLearning/Models/knn_model.pkl'
    modelo_knn = modelo.carrega_modelo(knn_path)
    
    acuracia_knn = avaliador.avaliar(modelo_knn, X_scaled, y)
    assert acuracia_knn >= 0.80  # Ajuste conforme necessário

# Teste para o modelo Naive Bayes
def test_modelo_naive_bayes():
    nb_path = './MachineLearning/Models/nb_model.pkl'
    modelo_nb = modelo.carrega_modelo(nb_path)
    
    acuracia_nb = avaliador.avaliar(modelo_nb, X_scaled, y)
    assert acuracia_nb >= 0.80  # Ajuste conforme necessário
