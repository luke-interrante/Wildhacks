import { useState, useEffect } from 'react'
import './App.css'
import supabase from './util/supabaseClient.js'

function App() {
  const [fetchError, setFetchError] = useState(null);
  const [users, setUsers] = useState(null);
  const [items, setItems] = useState(null);

  useEffect( () => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
      .from('users')
      .select();

      if (error) {
        setFetchError('Could not fetch the users');
        setUsers(null);
        console.log('Supabase error:', error);
      }

      if (data) {
        console.log('User Data from Supabase:', data);
        setUsers(data);
        setFetchError(null);
      } else {
        console.log('No data returned from Supabase');
      }
    }

    const fetchItems = async () => {
      const { data, error } = await supabase
      .from('items')
      .select();

      if (error) {
        setFetchError('Could not fetch the items');
        setItems(null);
        console.log('Supabase error:', error);
      }

      if (data) {
        console.log('Item Data from Supabase:', data);
        setItems(data);
        setFetchError(null);
      } else {
        console.log('No data returned from Supabase');
      }
    }

    fetchUsers();
    fetchItems();
  }, [])

  return (
    <div>
      {fetchError && (<p> {fetchError} </p>)}
      {users && (
        <div className='users'>
          { users.map(user => (
            <p key={user.id}> {user.first_name} </p>
          )) }
        </div>
      )}
      {items && (
        <div className='items'>
          { items.map(item => (
          <p key={item.id}> {item.name} </p>
          )) }
        </div>
      )}
    </div>
  )
}

export default App
