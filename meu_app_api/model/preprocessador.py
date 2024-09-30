import pickle

class PreProcessador:

    def escalonar(self, X):
        """ Escalonar os dados de entrada utilizando o scaler já treinado. """
        # Certifique-se de que o scaler está no caminho correto
        scaler = pickle.load(open('./MachineLearning/Models/scaler.pkl', 'rb'))
        X_scaled = scaler.transform(X)
        return X_scaled