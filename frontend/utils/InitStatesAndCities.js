// utils/initStatesAndCities.js
import axiosInstance from "@/utils/axiosInstance";

const initStatesAndCities = async () => {
  const statesWithCities = [
    {
      stateName: "Maharashtra",
      type: "State",
      cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Thane"]
    },
    {
      stateName: "Andhra Pradesh",
      type: "State",
      cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"]
    },
    {
      stateName: "Arunachal Pradesh",
      type: "State",
      cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang"]
    },
    {
      stateName: "Assam",
      type: "State",
      cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"]
    },
    {
      stateName: "Bihar",
      type: "State",
      cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"]
    },
    {
      stateName: "Chhattisgarh",
      type: "State",
      cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"]
    },
    {
      stateName: "Goa",
      type: "State",
      cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"]
    },
    {
      stateName: "Gujarat",
      type: "State",
      cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"]
    },
    {
      stateName: "Haryana",
      type: "State",
      cities: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"]
    },
    {
      stateName: "Himachal Pradesh",
      type: "State",
      cities: ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"]
    },
    {
      stateName: "Jharkhand",
      type: "State",
      cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"]
    },
    {
      stateName: "Karnataka",
      type: "State",
      cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belgaum"]
    },
    {
      stateName: "Kerala",
      type: "State",
      cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"]
    },
    {
      stateName: "Madhya Pradesh",
      type: "State",
      cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"]
    },
    {
      stateName: "Manipur",
      type: "State",
      cities: ["Imphal", "Thoubal", "Kakching", "Ukhrul"]
    },
    {
      stateName: "Meghalaya",
      type: "State",
      cities: ["Shillong", "Tura", "Jowai"]
    },
    {
      stateName: "Mizoram",
      type: "State",
      cities: ["Aizawl", "Lunglei", "Champhai"]
    },
    {
      stateName: "Nagaland",
      type: "State",
      cities: ["Kohima", "Dimapur", "Mokokchung"]
    },
    {
      stateName: "Odisha",
      type: "State",
      cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"]
    },
    {
      stateName: "Punjab",
      type: "State",
      cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"]
    },
    {
      stateName: "Rajasthan",
      type: "State",
      cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"]
    },
    {
      stateName: "Sikkim",
      type: "State",
      cities: ["Gangtok", "Namchi", "Gyalshing"]
    },
    {
      stateName: "Tamil Nadu",
      type: "State",
      cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
    },
    {
      stateName: "Telangana",
      type: "State",
      cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"]
    },
    {
      stateName: "Tripura",
      type: "State",
      cities: ["Agartala", "Udaipur", "Kailashahar"]
    },
    {
      stateName: "Uttar Pradesh",
      type: "State",
      cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"]
    },
    {
      stateName: "Uttarakhand",
      type: "State",
      cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani"]
    },
    {
      stateName: "West Bengal",
      type: "State",
      cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"]
    },
    // Union Territories
    {
      stateName: "Delhi",
      type: "Union Territory",
      cities: ["New Delhi", "Dwarka", "Rohini", "Saket"]
    },
    {
      stateName: "Chandigarh",
      type: "",
      cities: ["Chandigarh"]
    },
    {
      stateName: "Jammu and Kashmir",
      type: "",
      cities: ["Srinagar", "Jammu", "Anantnag"]
    },
    {
      stateName: "Ladakh",
      type: "",
      cities: ["Leh", "Kargil"]
    },
    {
      stateName: "Puducherry",
      type: "",
      cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    },
    {
      stateName: "Andaman and Nicobar Islands",
      type: "",
      cities: ["Port Blair", "Havelock", "Diglipur"]
    },
    {
      stateName: "Lakshadweep",
      type: "",
      cities: ["Kavaratti", "Agatti", "Minicoy"]
    }
  ];

  const alreadyInitialized = localStorage.getItem("statesCitiesInitialized");
  if (alreadyInitialized) return;

  try {
    const res = await axiosInstance.post("/api/locations/init", statesWithCities);
    console.log("✅ States & cities initialized:", res.data);
    localStorage.setItem("statesCitiesInitialized", "true");
  } catch (err) {
    console.error("❌ Error initializing states and cities", err);
  }
};

export default initStatesAndCities;
