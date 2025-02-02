import pickle

class Model:
    def carrega_modelo(self, path):
        """Dependendo se o final for .pkl ou .joblib, carregamos de uma forma ou de outra"""
        if path.endswith('.pkl'):
            with open(path, 'rb') as file:
                model = pickle.load(file)
        else:
            raise Exception('Formato de arquivo não suportado')
        return model

    
    def preditor(model, X_input):
        """Realiza a predição com base no modelo treinado"""
        diagnosis = model.predict(X_input)
        return diagnosis
