use std::io;

#[derive(Debug)]  // allows to print object, enum
enum CategorieTemperature {
    Froid,
    Tempere,
    Chaud,
}

struct TemperatureMoyenne {
    moyenne: f32,
    categorie: CategorieTemperature,
}

fn main() {
    let mut temperature: Vec<f32> = vec![22.0, 19.5, 21.0, 23.5, 20.0, 18.0, 25.0];
    println!("premières données récupérées!");

    if temperature.is_empty() {
        println!("Aucune température.");
        return;
    }

    loop {
        println!("Entrez une température à ajouter au tableau (ou entrez 'q' pour quitter) :");

        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Erreur de lecture de l'entrée.");

        if input.trim() == "q" {
            break;
        }

        let temp: f32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Valeur invalide. Veuillez entrer un nombre valide.");
                continue;
            }
        };

        temperature.push(temp);
    }

    let average = calculate_average(&temperature);
    let categorie = categoriser_temperature(average);

    // to format :    :.2 -> 2 decmals
    println!("Moyenne température : {:.2}°C", average);

    match categorie {
        CategorieTemperature::Froid => println!("La température est Froid."),
        CategorieTemperature::Tempere => println!("La température est Tempéré."),
        CategorieTemperature::Chaud => println!("La température est Chaud."),
    }

    trier_et_afficher_temperature(&mut temperature);
}


fn calculate_average(temps: &[f32]) -> f32 {
    let sum: f32 = temps.iter().sum();
    let count = temps.len() as f32;
    sum / count

    // or * 100 .rand / 100 to foramt with 2 decimals
}

fn categoriser_temperature(temperature: f32) -> CategorieTemperature {
    if temperature < 10_f32 {
        CategorieTemperature::Froid
    } else if temperature >= 10.0 && temperature <= 20.0 {
        CategorieTemperature::Tempere
    } else {
        CategorieTemperature::Chaud
    }
}

fn trier_et_afficher_temperature(temps: &mut [f32]) {
    temps.sort_by(|a, b| a.partial_cmp(b).unwrap());
    println!("Températures triées dans l'ordre croissant : {:?}", temps);
}