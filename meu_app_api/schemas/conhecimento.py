from pydantic import BaseModel
from typing import List
from model.conhecimento import Conhecimento

class ConhecimentoSchema(BaseModel):
    """ Define como um novo conhecimento a ser inserido deve ser representado
    """
    id_profissional: int = 1
    nome: str = "Testes Automatizados"
    nivel_conhecimento: int = 1

class ConhecimentoViewSchema(BaseModel):
    """ Define como um novo conhecimento a ser inserido deve ser representado
    """
    nome: str = "Testes Automatizados"

class ListagemConhecimentoSchema(BaseModel):
    """ Define como uma listagem de Profissionais será retornada.
    """
    conhecimentos:List[ConhecimentoSchema]

def apresenta_conhecimento(conhecimentos: List[Conhecimento]):
    """ Retorna uma representação do Profissional seguindo o schema definido em
        ProfissionalViewSchema.
    """
    result = []
    for conhecimento in conhecimentos:
        result.append({
            "nome": conhecimento.nome,
        })

    return {"Conhecimentos": result}

class ConhecimentoBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma busca
    """
    nome: str = "Testes Automatizados"

class ConhecimentoporIDBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma busca por id_profissional
    """
    id_profissional: int = 1

class ConhecimentoDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    id_profissional: int

