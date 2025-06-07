using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

IConfigurationRoot cf = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                                  .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
builder.Services.AddDbContext<CSDLBanHang>(otp => otp.UseSqlServer(cf.GetConnectionString("DefaultConnection")));

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 40 * 1024 * 1024; // Cho phép file tối đa 10MB
});


builder.Services.AddScoped<ColorSizesService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderDetailService>();
builder.Services.AddScoped<CommentService>();


builder.Services.AddHttpClient();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



//app.UseSwagger();
//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AppName v1");
//    c.RoutePrefix = String.Empty;
//}
//);

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(builder => builder
   .AllowAnyOrigin()
   .AllowAnyMethod()
   .AllowAnyHeader());

app.MapControllers();

app.Run();
