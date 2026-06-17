import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const useSupabase = supabaseUrl !== undefined && supabaseKey !== undefined;

let supabase = null;
if (useSupabase) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
}

export async function readDB() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase
        .from('menu_db')
        .select('data')
        .eq('id', 1)
        .single();
      
      if (error) {
        // PGRST116: 0 rows returned, meaning we need to initialize
        if (error.code === 'PGRST116') {
          const initialData = { 
            categories: [], 
            products: [], 
            settings: {
              welcomeLogo: "",
              welcomeDesc: "Eşsiz baharatlar ve taze malzemelerle hazırlanan saray lezzetlerine hoş geldiniz.",
              welcomeDesc_en: "",
              welcomeDesc_ar: ""
            }, 
            campaigns: [], 
            users: [{ username: 'admin', password: '4366' }] 
          };
          // Initialize table row
          await supabase.from('menu_db').upsert({ id: 1, data: initialData });
          return initialData;
        }
        console.error('Supabase DB fetch error:', error);
        throw error;
      }
      
      return data.data;
    } catch (error) {
      console.error('Supabase read error:', error);
      return { 
        categories: [], 
        products: [], 
        settings: {
          welcomeLogo: "",
          welcomeDesc: "Eşsiz baharatlar ve taze malzemelerle hazırlanan saray lezzetlerine hoş geldiniz.",
          welcomeDesc_en: "",
          welcomeDesc_ar: ""
        }, 
        campaigns: [], 
        users: [{ username: 'admin', password: '4366' }] 
      };
    }
  }

  // Local fallback
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = { 
        categories: [], 
        products: [], 
        settings: {
          welcomeLogo: "",
          welcomeDesc: "Eşsiz baharatlar ve taze malzemelerle hazırlanan saray lezzetlerine hoş geldiniz.",
          welcomeDesc_en: "",
          welcomeDesc_ar: ""
        }, 
        campaigns: [], 
        users: [{ username: 'admin', password: '4366' }] 
      };
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Local Database read error:', error);
    return { 
      categories: [], 
      products: [], 
      settings: {
        welcomeLogo: "",
        welcomeDesc: "Eşsiz baharatlar ve taze malzemelerle hazırlanan saray lezzetlerine hoş geldiniz.",
        welcomeDesc_en: "",
        welcomeDesc_ar: ""
      }, 
      campaigns: [], 
      users: [{ username: 'admin', password: '4366' }] 
    };
  }
}

export async function writeDB(data) {
  if (useSupabase) {
    try {
      const { error } = await supabase
        .from('menu_db')
        .upsert({ id: 1, data });
      if (error) {
        console.error('Supabase DB upsert error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Supabase write error:', error);
      return false;
    }
  }

  // Local fallback
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Local Database write error:', error);
    return false;
  }
}
