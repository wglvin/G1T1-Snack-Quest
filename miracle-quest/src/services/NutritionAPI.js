// NutritionAPI.js
import axios from 'axios';

// Replace hardcoded API key with environment variable
const API_KEY = import.meta.env.VITE_RAPID_API_KEY;

async function fetchNutritionData({ sex, age, height, weight, activity }) {
    return new Promise((resolve, reject) => {
        const apiUrl = 'https://nutrition-calculator.p.rapidapi.com/api/nutrition-info';

        axios.get(apiUrl, { 
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'nutrition-calculator.p.rapidapi.com'
            },
            params: {
                measurement_units: 'met',
                sex: sex,
                age_value: age,
                age_type: 'yrs',
                cm: height,
                kilos: weight,
                activity_level: activity
            }
        })
        .then(response => {
            const data = response.data;
            const bmi = data.BMI_EER ? data.BMI_EER.BMI : "N/A";
            const calorie_needs = data.BMI_EER ? data.BMI_EER["Estimated Daily Caloric Needs"] : "N/A";
            const macronutrients = data.macronutrients_table ? data.macronutrients_table["macronutrients-table"] : [];

            const macronutrient_dict = {};
            macronutrients.forEach(item => {
                macronutrient_dict[item[0]] = item[1];
            });

            const result = {
                carbohydrates: macronutrient_dict["Carbohydrate"] || "N/A",
                protein: macronutrient_dict["Protein"] || "N/A",
                fat: macronutrient_dict["Fat"] || "N/A",
                fiber: macronutrient_dict["Total Fiber"] || "N/A",
                bmi: bmi,
                calorieNeeds: calorie_needs
            };

            resolve(result); // Resolve with the data object
        })
        .catch(error => {
            reject(error); // Reject in case of error
        });
    });
}

export { fetchNutritionData };
