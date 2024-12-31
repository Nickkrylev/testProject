const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    }, []);
  
    const login = (user: string) => {
      sessionStorage.setItem("user", user);
      setUser(user);
      setIsAuthenticated(true);
    };
  
    const logout = () => {
      sessionStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  