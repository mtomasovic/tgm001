function App() {
    React.useEffect(() => {
        document.title = "test game 001";
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ 
                fontSize: '48px', 
                color: '#333',
                textAlign: 'center'
            }}>
                test game 001
            </h1>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
