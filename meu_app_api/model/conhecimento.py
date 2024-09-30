from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from datetime import datetime
from typing import Union

from  model import Base


class Conhecimento(Base):
    __tablename__ = 'conhecimento'

    id = Column(Integer, primary_key=True)
    nome = Column(String(4000))
    nivel_conhecimento = Column(Integer)
    data_insercao = Column(DateTime, default=datetime.now())
    

    # Definição do relacionamento entre o conhecimento e um profissional.
    # Aqui está sendo definido a coluna 'id_profissional' que vai guardar
    # a referencia ao profissional, a chave estrangeira que relaciona
    # um profissional ao conhecimento.
    id_profissional = Column(Integer, ForeignKey("profissional.id"), nullable=False)

    def __init__(self, nome:str, nivel_conhecimento:int, data_insercao:Union[DateTime, None] = None):
        """
        Cria um conhecimento

        Arguments:
            nome: o nome de um conhecimento.
            data_insercao: data de quando o conhecimento foi feito ou inserido
                           à base
        """
        self.nome = nome
        self.nivel_conhecimento = nivel_conhecimento
        if data_insercao:
            self.data_insercao = data_insercao
