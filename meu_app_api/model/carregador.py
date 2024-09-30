import pandas as pd

class Carregador:

    def carregar_dados(self, url: str):
        """ Carrega e retorna um DataFrame. """
        return pd.read_csv(url, header=0, delimiter=',')  # Ajustar conforme o seu CSV
