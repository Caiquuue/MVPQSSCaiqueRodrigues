from pydantic import BaseModel
from typing import Optional, List
from model.profissional import Profissional

from schemas import ConhecimentoSchema


class ProfissionalSchema(BaseModel):
    """ Define como um novo Profissional a ser inserido deve ser representado
    """
    celular: str = "21989002549"
    email: str = "caaiquuee@gmail.com"
    nome: str = "Caique"
    anos_experiencia: int = 4
    categoria: str = "Pleno"


class ProfissionalBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca. Que será
        feita apenas com base no nome do Profissional.
    """
    nome: str = "Teste"



class ListagemProfissionaisSchema(BaseModel):
    """ Define como uma listagem de Profissionais será retornada.
    """
    profissionais:List[ProfissionalSchema]


def apresenta_profissionais(profissionais: List[Profissional]):
    """ Retorna uma representação do Profissional seguindo o schema definido em
        ProfissionalViewSchema.
    """
    result = []
    for profissional in profissionais:
        result.append({
            "nome": profissional.nome,
            "celular": profissional.celular,
            "email": profissional.email,
            "id": profissional.id,
            "anos_experiencia":profissional.anos_experiencia,
            "categoria": profissional.categoria
        })

    return {"Profissionais": result}


class ProfissionalViewSchema(BaseModel):
    """ Define como um Profissional será retornado: Profissional + comentários.
    """
    id: int = 1
    nome: str = "João Emanuel"
    celular: str = 21989002549
    email: str = "caaiquuee@gmail.com"
    total_conhecimentos: int = 1
    conhecimentos:List[ConhecimentoSchema]


class ProfissionalDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    mesage: str
    nome: str

def apresenta_Profissional(profissional: Profissional):
    """ Retorna uma representação do Profissional seguindo o schema definido em
        ProfissionalViewSchema.
    """
    return {
        "id": profissional.id,
        "nome":  profissional.nome,
        "celular": profissional.celular,
        "email": profissional.email,
        "total_cometarios": len(profissional.conhecimentos),
        "comentarios": [{"nome": c.nome} for c in profissional.conhecimentos]
    }
