{
  description = "Ma Petite Compagnie - Application de gestion pour compagnie de théâtre";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              nodejs_22
              nodePackages.npm
              openssl
              prisma-engines
            ];

            shellHook = ''
              export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
              export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
              export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
              echo "Ma Petite Compagnie - Dev environment ready"
              echo "Node $(node --version) | npm $(npm --version)"
            '';
          };
        });
    };
}
