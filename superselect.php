<?php

// Search dog breeds
$dog_breeds = array(
	"Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akbash", "Akita", "Alaskan Malamute", "American Bulldog", "American Eskimo", "American Hairless Terrier", 
	"American Staffordshire Terrier", "American Water Spaniel", "Anatolian Shepherd", "Appenzell Mountain", "Australian Cattle", "Australian Kelpie", "Australian Shepherd", 
	"Australian Terrier", "Basenji", "Basset Hound", "Beagle", "Bearded Collie", "Beauceron", "Bedlington Terrier", "Belgian Shepherd", "Belgian Shepherd Laekenois", "Belgian Shepherd Malinois", 
	"Belgian Shepherd Tervuren", "Bernese Mountain", "Bichon Frise", "Black And Tan Coonhound", "Black Labrador Retriever", "Black Mouth Cur", "Black Russian Terrier", "Bloodhound", "Blue Lacy", 
	"Bluetick Coonhound", "Boerboel", "Bolognese", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier Des Flanders", "Boxer", "Boykin Spaniel", "Briard", "Brittany Spaniel", 
	"Brussels Griffon", "Bull Terrier", "Bullmastiff", "Cairn Terrier", "Canaan", "Cane Corso Mastiff", "Carolina", "Catahoula Leopard", "Cattle", "Caucasian Sheepdog", "Cavalier King Charles Spaniel", 
	"Chesapeake Bay Retriever", "Chihuahua", "Chinese Crested", "Chinese Foo", "Chinook", "Chocolate Labrador Retriever", "Chow Chow", "Cirneco Dell'etna", "Clumber Spaniel", "Cockapoo", 
	"Cocker Spaniel", "Collie", "Coonhound", "Corgi", "Coton De Tulear", "Curly-Coated Retriever", "Dachshund", "Dalmatian", "Dandi Dinmont Terrier", "Doberman Pinscher", "Dogo Argentino", 
	"Dogue De Bordeaux", "Dachshund", "Dutch Shepherd", "English Bulldog", "English Cocker Spaniel", "English Coonhound", "English Pointer", "English Setter", "English Shepherd", 
	"English Springer Spaniel", "English Toy Spaniel", "Entlebucher", "Eskimo", "Feist", "Field Spaniel", "Fila Brasileiro", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever", 
	"Fox Terrier", "Foxhound", "French Bulldog", "Galgo Spanish Greyhound", "German Pinscher", "German Shepherd", "German Shorthaired Pointer", "German Spitz", "German Wirehaired Pointer", 
	"Giant Schnauzer", "Glen Of Imaal Terrier", "Golden Retriever", "Gordon Setter", "Great Dane", "Great Pyrenees", "Greater Swiss Mountain", "Greyhound", "Harrier", "Havanese", "Hound", 
	"Hovawart", "Husky", "Ibizan Hound", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound", "Italian Spinone", "Jack Russell Terrier", "Japanese Chin", 
	"Jindo", "Kai", "Karelian Bear", "Keeshond", "Kerry Blue Terrier", "Kishu", "Klee Kai", "Komondor", "Kuvasz", "Labrador Retriever", "Lakeland Terrier", "Lancashire Heeler", "Leonberger", 
	"Lhasa Apso", "Lowchen", "Maltese", "Manchester Terrier", "Maremma Sheepdog", "Mastiff", "Mcnab", "Miniature Pinscher", "Mountain Cur", "Mountain", "Munsterlander", "Neapolitan Mastiff", 
	"New Guinea Singing", "Newfoundland", "Norfolk Terrier", "Norwegian Elkhound", "Norwegian Lundehund", "Norwich Terrier", "Nova Scotia Duck-Tolling Retriever", "Old English Sheepdog", 
	"Otterhound", "Papillon", "Patterdale Terrier", "Pekingese", "Peruvian Inca Orchid", "Petit Basset Griffon Vendeen", "Pharaoh Hound", "Pit Bull Terrier", "Plott Hound", "Podengo Portugueso", 
	"Pointer", "Pomeranian", "Poodle", "Portuguese Water", "Presa Canario", "Pug", "Puli", "Rat Terrier", "Redbone Coonhound", "Retriever", "Rhodesian Ridgeback", "Rottweiler", 
	"Saint Bernard St. Bernard", "Saluki", "Samoyed", "Schipperke", "Schnauzer", "Scottish Deerhound", "Scottish Terrier Scottie", "Sealyham Terrier", "Setter", "Shar Pei", "Sheep", 
	"Shepherd", "Shetland Sheepdog Sheltie", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Silky Terrier", "Skye Terrier", "Smooth Fox Terrier", "Spaniel", "Spitz", "Staffordshire Bull Terrier", 
	"Standard Poodle", "Sussex Spaniel", "Swedish Vallhund", "Terrier", "Thai Ridgeback", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Toy Fox Terrier", "Treeing Walker Coonhound", 
	"Vizsla", "Weimaraner", "Welsh Corgi", "Welsh Springer Spaniel", "Welsh Terrier", "West Highland White Terrier Westie", "Wheaten Terrier", "Whippet", "White German Shepherd", 
	"Wire Fox Terrier", "Wire-Haired Pointing Griffon", "Wirehaired Terrier", "Xoloitzcuintle", "Yellow Labrador Retriever", "Yorkshire Terrier Yorkie"
);

$val = $_POST['superselect_search'];
$results = array();

if($val != ''){
	foreach($dog_breeds as $breed){
		if (preg_match("/".$val."/i", $breed)) {
			// Found - Add to results array
			$results[strtolower($breed)] = $breed; 
		}
	}
}

echo json_encode($results);

?>