using GuffGaff.Database.DBContext;
using GuffGaff.Services.Interfaces;
using GuffGaff.Services.Services;
using Microsoft.EntityFrameworkCore;
using WBpro.Services.Interfaces;
using WBpro.Services.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GuffGaffDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IPostServices, PostServices>();
builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddScoped<ICommentServices, CommentServices>();
builder.Services.AddScoped<IFeedServices, FeedServices>();
builder.Services.AddScoped<IJwtTokenHandler, JwtTokenHandler>();
builder.Services.AddScoped<IMiscellaneous, Miscellaneous>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontEnd");
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.Run();
