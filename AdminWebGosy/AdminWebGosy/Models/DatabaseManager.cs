using System;
using Microsoft.Extensions.Configuration;

public sealed class DatabaseManager
{
    private static readonly Lazy<DatabaseManager> _instance = new Lazy<DatabaseManager>(() => new DatabaseManager());
    public static DatabaseManager Instance => _instance.Value;

    public string ConnectionString { get; }

    private DatabaseManager()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        ConnectionString = configuration.GetConnectionString("DefaultConnection");
    }
}
