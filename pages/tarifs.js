import Header from '../components/Header';

export default function Tarifs() {
    return (
        <>
            <Header />
            <div className="p-10 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Tarifs</h1>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Séance individuelle (1h) : 50€</li>
                    <li>Séance enfant/adolescent : 40€</li>
                    <li>Accompagnement entreprise : sur devis</li>
                </ul>
            </div>
        </>
    );
}