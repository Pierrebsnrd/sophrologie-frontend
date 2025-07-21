import Header from "../components/Header";
export default function FAQ() {
    return (
        <>
            <Header />
            <div className="p-10 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">FAQ</h1>
                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold">Combien de séances sont nécessaires ?</h2>
                        <p>Le nombre de séances dépend des objectifs de chacun. En général, un minimum de 5 à 8 séances permet de constater des bénéfices durables.</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Est-ce remboursé par la sécurité sociale ?</h2>
                        <p>La sophrologie n’est pas remboursée par la sécurité sociale, mais certaines mutuelles prennent en charge les séances.</p>
                    </div>
                </div>
            </div>
        </>
    );
}