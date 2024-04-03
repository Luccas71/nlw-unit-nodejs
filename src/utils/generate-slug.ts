export function generateSlug(text: string): string {
    return text
        .normalize("NFD") // Normaliza caracteres Unicode para a forma de composição
        .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/[^\w\-]+/g, "") // Remove caracteres não alfanuméricos exceto hífens
        .toLowerCase(); // Converte para minúsculas
}