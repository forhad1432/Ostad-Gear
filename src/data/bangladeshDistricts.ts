export interface District {
  name: string;
  bnName: string;
  division: string;
  isDhaka: boolean;
}

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { name: 'Dhaka', bnName: 'ঢাকা', division: 'Dhaka', isDhaka: true },
  { name: 'Gazipur', bnName: 'গাজীপুর', division: 'Dhaka', isDhaka: false },
  { name: 'Narayanganj', bnName: 'নারায়ণগঞ্জ', division: 'Dhaka', isDhaka: false },
  { name: 'Tangail', bnName: 'টাঙ্গাইল', division: 'Dhaka', isDhaka: false },
  { name: 'Narsingdi', bnName: 'নরসিংদী', division: 'Dhaka', isDhaka: false },
  { name: 'Faridpur', bnName: 'ফরিদপুর', division: 'Dhaka', isDhaka: false },
  { name: 'Manikganj', bnName: 'মানিকগঞ্জ', division: 'Dhaka', isDhaka: false },
  { name: 'Munshiganj', bnName: 'মুন্সীগঞ্জ', division: 'Dhaka', isDhaka: false },
  { name: 'Kishoreganj', bnName: 'কিশোরগঞ্জ', division: 'Dhaka', isDhaka: false },

  // Chittagong Division
  { name: 'Chattogram', bnName: 'চট্টগ্রাম', division: 'Chattogram', isDhaka: false },
  { name: 'Cox\'s Bazar', bnName: 'কক্সবাজার', division: 'Chattogram', isDhaka: false },
  { name: 'Cumilla', bnName: 'কুমিল্লা', division: 'Chattogram', isDhaka: false },
  { name: 'Feni', bnName: 'ফেনী', division: 'Chattogram', isDhaka: false },
  { name: 'Noakhali', bnName: 'নোয়াখালী', division: 'Chattogram', isDhaka: false },
  { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', isDhaka: false },
  { name: 'Chandpur', bnName: 'চাঁদপুর', division: 'Chattogram', isDhaka: false },

  // Sylhet Division
  { name: 'Sylhet', bnName: 'সিলেট', division: 'Sylhet', isDhaka: false },
  { name: 'Moulvibazar', bnName: 'মৌলভীবাজার', division: 'Sylhet', isDhaka: false },
  { name: 'Habiganj', bnName: 'হবিগঞ্জ', division: 'Sylhet', isDhaka: false },
  { name: 'Sunamganj', bnName: 'সুনামগঞ্জ', division: 'Sylhet', isDhaka: false },

  // Rajshahi Division
  { name: 'Rajshahi', bnName: 'রাজশাহী', division: 'Rajshahi', isDhaka: false },
  { name: 'Bogura', bnName: 'বগুড়া', division: 'Rajshahi', isDhaka: false },
  { name: 'Pabna', bnName: 'পাবনা', division: 'Rajshahi', isDhaka: false },
  { name: 'Sirajganj', bnName: 'সিরাজগঞ্জ', division: 'Rajshahi', isDhaka: false },
  { name: 'Naogaon', bnName: 'নওগাঁ', division: 'Rajshahi', isDhaka: false },

  // Khulna Division
  { name: 'Khulna', bnName: 'খুলনা', division: 'Khulna', isDhaka: false },
  { name: 'Jashore', bnName: 'যশোর', division: 'Khulna', isDhaka: false },
  { name: 'Kushtia', bnName: 'কুষ্টিয়া', division: 'Khulna', isDhaka: false },
  { name: 'Satkhira', bnName: 'সাতক্ষীরা', division: 'Khulna', isDhaka: false },

  // Barishal Division
  { name: 'Barishal', bnName: 'বরিশাল', division: 'Barishal', isDhaka: false },
  { name: 'Patuakhali', bnName: 'পটুয়াখালী', division: 'Barishal', isDhaka: false },
  { name: 'Bhola', bnName: 'ভোলা', division: 'Barishal', isDhaka: false },

  // Rangpur Division
  { name: 'Rangpur', bnName: 'রংপুর', division: 'Rangpur', isDhaka: false },
  { name: 'Dinajpur', bnName: 'দিনাজপুর', division: 'Rangpur', isDhaka: false },

  // Mymensingh Division
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ', division: 'Mymensingh', isDhaka: false },
  { name: 'Jamalpur', bnName: 'জামালপুর', division: 'Mymensingh', isDhaka: false },
  { name: 'Netrokona', bnName: 'নেত্রকোণা', division: 'Mymensingh', isDhaka: false },
];

export const PAYMENT_NUMBERS = {
  bkash: '01572923114',
  nagad: '01572923114',
  rocket: '01537-506154',
  secondaryNumber: '01537-506154',
};

export const STORE_CONTACT = {
  address: '335, Abu Sayeed Market (3rd Floor), Rampura, DIT Road, Dhaka, Bangladesh, 1219',
  addressShort: 'Rampura, DIT Road, Dhaka-1219',
  phone1: '01572923114',
  phone2: '01537-506154',
  facebook: 'https://www.facebook.com/profile.php?id=61571997341321',
};
