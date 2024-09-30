from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Union

from model import Base, Conhecimento

class Profissional(Base):
    __tablename__ = 'profissional'

    id = Column(Integer, primary_key=True)
    celular = Column(String)
    email = Column(String)
    nome = Column(String(140), unique=True)
    anos_experiencia = Column(Integer)
    data_insercao = Column(DateTime, default=datetime.now())
    categoria = Column(String)
    
    # Inicializa num_conhecimentos como 0
    num_conhecimentos = Column(Integer, default=0)

    # Relacionamento com Conhecimento
    conhecimentos = relationship("Conhecimento")

    def __init__(self, nome: str, celular: str, email: str, anos_experiencia: int, categoria: str,
                 data_insercao: Union[DateTime, None] = None):
        """
        Cria um profissional

        Arguments:
            nome: nome do profissional.
            celular: celular do profissional
            email: email do profissional
            data_insercao: data de quando o profissional foi inserido à base
        """
        self.nome = nome
        self.celular = celular
        self.email = email
        self.anos_experiencia = anos_experiencia
        self.categoria = categoria

        if data_insercao:
            self.data_insercao = data_insercao

        # Garante que num_conhecimentos começa em 0
        self.num_conhecimentos = 0

    def adiciona_conhecimento(self, conhecimento: Conhecimento):
        """ Adiciona um novo conhecimento ao profissional """
        self.num_conhecimentos += 1
        self.conhecimentos.append(conhecimento)