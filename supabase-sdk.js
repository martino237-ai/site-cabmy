/*! Supabase JS Client v2.27.0 - Minimal wrapper */
if (!window.supabase) {
  window.supabase = {
    createClient: function(url, key) {
      return {
        from: function(table) {
          const baseUrl = url.replace(/\/$/, '');
          const restUrl = baseUrl + '/rest/v1';
          
          return {
            select: function(columns = '*') {
              return {
                eq: function(col, val) {
                  return {
                    async execute() {
                      try {
                        const query = `${columns}&${col}=eq.${val}`;
                        const res = await fetch(`${restUrl}/${table}?${query}`, {
                          headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return { data: await res.json(), error: null };
                      } catch (err) {
                        return { data: null, error: err };
                      }
                    }
                  };
                },
                order: function(col, opts = {}) {
                  return {
                    async execute() {
                      try {
                        const dir = opts.ascending ? 'asc' : 'desc';
                        const query = `${columns}&order=${col}.${dir}`;
                        const res = await fetch(`${restUrl}/${table}?${query}`, {
                          headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return { data: await res.json(), error: null };
                      } catch (err) {
                        return { data: null, error: err };
                      }
                    },
                    limit: function(n) {
                      return {
                        async execute() {
                          try {
                            const dir = opts.ascending ? 'asc' : 'desc';
                            const query = `${columns}&order=${col}.${dir}&limit=${n}`;
                            const res = await fetch(`${restUrl}/${table}?${query}`, {
                              headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                            });
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            return { data: await res.json(), error: null };
                          } catch (err) {
                            return { data: null, error: err };
                          }
                        }
                      };
                    }
                  };
                },
                limit: function(n) {
                  return {
                    async execute() {
                      try {
                        const query = `${columns}&limit=${n}`;
                        const res = await fetch(`${restUrl}/${table}?${query}`, {
                          headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return { data: await res.json(), error: null };
                      } catch (err) {
                        return { data: null, error: err };
                      }
                    }
                  };
                }
              };
            },
            insert: function(rows) {
              return {
                async execute() {
                  try {
                    const res = await fetch(`${restUrl}/${table}`, {
                      method: 'POST',
                      headers: { 
                        'apikey': key, 
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(Array.isArray(rows) ? rows : [rows])
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
                    return { data: await res.json(), error: null };
                  } catch (err) {
                    return { data: null, error: err };
                  }
                },
                select: function(cols) {
                  return {
                    single: function() {
                      return {
                        async execute() {
                          try {
                            const res = await fetch(`${restUrl}/${table}?select=${cols}`, {
                              method: 'POST',
                              headers: { 
                                'apikey': key, 
                                'Authorization': `Bearer ${key}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(Array.isArray(rows) ? rows[0] : rows)
                            });
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            const data = await res.json();
                            return { data: Array.isArray(data) ? data[0] : data, error: null };
                          } catch (err) {
                            return { data: null, error: err };
                          }
                        }
                      };
                    }
                  };
                }
              };
            },
            update: function(payload) {
              return {
                eq: function(col, val) {
                  return {
                    async execute() {
                      try {
                        const res = await fetch(`${restUrl}/${table}?${col}=eq.${val}`, {
                          method: 'PATCH',
                          headers: { 
                            'apikey': key, 
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(payload)
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return { data: await res.json(), error: null };
                      } catch (err) {
                        return { data: null, error: err };
                      }
                    }
                  };
                }
              };
            },
            delete: function() {
              return {
                eq: function(col, val) {
                  return {
                    async execute() {
                      try {
                        const res = await fetch(`${restUrl}/${table}?${col}=eq.${val}`, {
                          method: 'DELETE',
                          headers: { 
                            'apikey': key, 
                            'Authorization': `Bearer ${key}`
                          }
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return { data: null, error: null };
                      } catch (err) {
                        return { data: null, error: err };
                      }
                    }
                  };
                }
              };
            }
          };
        }
      };
    }
  };
}
