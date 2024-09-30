from sklearn.metrics import accuracy_score

class Avaliador:

    def avaliar(self, model, X_test, y_test):
        """ Faz uma predição e avalia o modelo com base na acurácia. """
        # Fazer predições no conjunto de teste
        predicoes = model.predict(X_test)

        # Calcular a acurácia
        return accuracy_score(y_test, predicoes)

