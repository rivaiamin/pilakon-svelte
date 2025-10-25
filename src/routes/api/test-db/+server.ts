import { json } from '@sveltejs/kit';
import { supabase } from '$lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Test 1: Basic Supabase connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth test:', { authData, authError });

    // Test 2: Test Supabase database query (using Supabase client, IPv6 compatible)
    const { data: testData, error: dbError } = await supabase
      .from('asset_categories')
      .select('*')
      .limit(1);

    console.log('Database test query result:', testData);

    return json({ 
      success: true, 
      message: 'Supabase connection successful',
      authConnected: !authError,
      databaseConnected: !dbError,
      testQuery: testData
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
};
