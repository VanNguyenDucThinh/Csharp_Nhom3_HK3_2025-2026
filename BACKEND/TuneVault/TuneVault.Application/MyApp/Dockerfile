# Sử dụng image .NET SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy toàn bộ project vào container
COPY . .

# Restore và build project
RUN dotnet restore
RUN dotnet publish -c Release -o /app

# Sử dụng image .NET runtime để chạy
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Chạy ứng dụng
ENTRYPOINT ["dotnet", "MyApp.dll"]