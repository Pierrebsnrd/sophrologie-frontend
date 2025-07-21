import Header from "../components/Header";

export default function Contact() {
    return (
        <>
            <Header />
            <div className="p-10 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Contact</h1>
                <p>Pour toute demande, vous pouvez me contacter par mail à <a href="mailto:sophie@example.com" className="text-blue-600 underline">sophie@example.com</a> ou via le formulaire ci-dessous.</p>
                {/* Tu peux ajouter ici un vrai formulaire de contact plus tard */}
            </div>
        </>
    );
}