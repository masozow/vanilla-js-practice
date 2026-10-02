export const initUserUI = (userRepo, dom) => {
    const { input, results, loading, error } = dom;

    const renderUsers = (users) => {
        results.innerHTML = users.map(user => `
      <div class="card">
        <h3>${user.name}</h3>
      </div>
    `).join('');
    };

    input.addEventListener('input', async (e) => {
        loading.classList.remove('hidden');
        try {
            const users = await userRepo.search(e.target.value);
            renderUsers(users);
        } catch (err) {
            error.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });
};